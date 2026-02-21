/*
 * Copyright (c) Alexey Gara 2025.
 * "Chesstles-TS" project
 * Current file: "StateMachine.ts"
 * Last modified date: 28.12.2025, 05:23
 * All rights reserved.
 */

import type {
	HandleEventTransitionResult,
	ICanStateChange,
	ICanStatesRegister,
	IState,
	ITransitionStrategy,
	OverlayTransitionProvider,
	Transition,
	TransitionWithLinkedFromStateField
}                                       from "@core-api/fsm-types";
import { StateMachineHandleEventError } from "core/errors/flow/StateMachineHandleEventError";
import { StateMachineTransitionError }  from "core/errors/flow/StateMachineTransitionError";
import {
	checkTransitionPermit,
	findTransition,
	resolveDominantState,
	resolveTransitionStrategy
}                                       from "core/fsm/fsm-tools";
import { OverlayClose }                 from "core/fsm/strategy/OverlayClose";
import {
	overlayStrategiesProvider,
	processStatesClosing
}                                       from "core/fsm/strategy/strategies";
import { TransitionStrategy }           from "core/fsm/strategy/TransitionStrategy";

export abstract class StateMachine<TSTATEid extends STATEidBase,
	TEvents extends EventBase,
	TContext extends ContextBase>

	implements ICanStateChange<TSTATEid, TEvents>,
			   ICanStatesRegister<TSTATEid, TEvents, TContext> {

	get baseState():TSTATEid | null {
		return this._baseState?.stateId || null;
	}

	get overlayStates():ReadonlyArray<TSTATEid> {
		return [...this._overlayStates].map((state) => state.stateId);
	}

	get dominantState():TSTATEid | null {
		if(!this._baseState) {
			return null;
		}
		return resolveDominantState(this._baseState, [...this._overlayStates]).stateId;
	}

	private readonly _stateProviders:Map<TSTATEid, () => IState<TSTATEid, TEvents>>        = new Map();
	private readonly _transitions:Map<TSTATEid, Transition<TSTATEid, TEvents, TContext>[]> = new Map();
	private readonly _transitionStrategy:ITransitionStrategy<TSTATEid, TEvents>;
	private readonly _overlayStrategyProvider:OverlayTransitionProvider<TSTATEid, TEvents>;
	private readonly _overlayCloseStrategy:ITransitionStrategy<TSTATEid, TEvents>;
	private _onTransition?:Transition<TSTATEid, TEvents, TContext>;
	private _baseState?:IState<TSTATEid, TEvents>;
	private readonly _overlayStates:Set<IState<TSTATEid, TEvents>>                         = new Set();
	private readonly _context:TContext;

	protected constructor(
		context:TContext,
		transitionStrategy?:ITransitionStrategy<TSTATEid, TEvents>,
		overlayStrategyProvider?:OverlayTransitionProvider<TSTATEid, TEvents>,
		overlayCloseStrategy?:ITransitionStrategy<TSTATEid, TEvents>
	) {
		this._context                 = context;
		this._transitionStrategy      = transitionStrategy || new TransitionStrategy();
		this._overlayStrategyProvider = overlayStrategyProvider || overlayStrategiesProvider;
		this._overlayCloseStrategy    = overlayCloseStrategy || new OverlayClose();
	}

	registerState<K extends TSTATEid>(stateId:K, stateProvider:() => IState<K, TEvents>):void {
		if(this._stateProviders.has(stateId)) {
			logger.warn(`[StateMachine]: State "${stateId}" already registered!`);
			return;
		}
		this._stateProviders.set(stateId, stateProvider);
	}

	registerTransitions<K extends TSTATEid>(
		fromStateId:K,
		transitions:TransitionWithLinkedFromStateField<K, TSTATEid, TEvents, TContext>[]
	):void {
		const list = this._transitions.get(fromStateId);
		if(!list) {
			this._transitions.set(fromStateId, transitions);
			return;
		}
		for(const transition of transitions) {
			if(!list.includes(transition)) {
				list.push(transition);
			}
		}
	}

	async init(stateId:TSTATEid, payload:TEvents[keyof TEvents]):Promise<boolean> {
		if(this._baseState) {
			return this._baseState.stateId == stateId;
		}

		const initialState = this._createState(stateId);
		if(!initialState) {
			return false;
		}

		await this._transitionStrategy.doTransition([],
													initialState,
													payload);

		this._baseState = initialState;

		return true;
	}

	async destroy():Promise<void> {
		if(!this._baseState) {
			return;
		}

		await processStatesClosing([...[...this._overlayStates].reverse(), this._baseState]);

		this._overlayStates.clear();
		delete this._baseState;
	}

	async handle(event:keyof TEvents,
				 payload:TEvents[keyof TEvents]):Promise<HandleEventTransitionResult<TSTATEid>> {

		if(!this._baseState) {
			throw new StateMachineHandleEventError(`State machine not initialized yet!`);
		}

		const [transition, fromState] = findTransition(event,
													   this._baseState, [...this._overlayStates],
													   this._transitions);
		if(!transition) {
			throw new StateMachineHandleEventError(`Transition for event '${String(event)}' not found.`);
		}

		const isPermitted = checkTransitionPermit(resolveDominantState(this._baseState, [...this._overlayStates]),
												  event, transition,
												  this._stateProviders.has,
												  this._context,
												  this._onTransition);
		if(isPermitted !== true) {
			return isPermitted;
		}

		if(this._onTransition) {
			//TODO: implement current transition cancellation and remove this: @see checkTransitionPermit
			await Promise.resolve();
		}

		// start transition process -->
		this._onTransition = transition;

		// do a specified action before transition-block started:
		transition.action?.(this._context, payload);

		// try to get target state to transit (possibly undefined):
		let toState = transition.toStateId && this._createState(transition.toStateId);

		// transition block: [
		const transitionStrategy = resolveTransitionStrategy(fromState, toState,
															 this._transitionStrategy,
															 this._overlayStrategyProvider,
															 this._overlayCloseStrategy);

		// resolve all states that must be exited and closed:
		const fromStates = [fromState];
		for(const overlayOnTop of [...this._overlayStates].reverse()) {
			if(overlayOnTop == fromState) {
				break;
			}

			fromStates.unshift(overlayOnTop);
			this._overlayStates.delete(overlayOnTop);
		}

		// resolve the truly state to enter/restore:
		if(!toState) {
			toState = this._overlayStates.size
					  ? [...this._overlayStates].pop()!
					  : this._baseState;
		}

		// add new state to actives:
		if(toState.overlayMode) {
			this._overlayStates.add(toState);
		}
		else {
			this._baseState = toState;
		}

		try {
			await transitionStrategy.doTransition(fromStates, toState, payload);
		}
		catch(e) {
			throw new StateMachineTransitionError(toState.stateId,
												  `The transition from '${fromState.stateId}' to '${toState.stateId}' was permitted, but an error occurred!`,
												  e);
		}

		// ] transition block ended

		// complete transition process <--
		delete this._onTransition;

		return {
			triggerEvent: String(event),
			result:       "success"
		};
	}

	private _createState(stateId:TSTATEid):IState<TSTATEid, TEvents> {
		const stateProvider = this._stateProviders.get(stateId);
		if(!stateProvider) {
			throw new StateMachineTransitionError(stateId,
												  `Cannot find state '${stateId}' provider! Possibly state '${stateId}' have not been registered at state machine.`);
		}
		return stateProvider();
	}

}