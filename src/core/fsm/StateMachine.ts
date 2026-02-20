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
	resolveTransitionStrategy
}                                       from "core/fsm/fsm-utils";
import { overlayStrategiesProvider }    from "core/fsm/strategy/strategies";
import { TransitionStrategy }           from "core/fsm/strategy/TransitionStrategy";

export abstract class StateMachine<TSTATEid extends STATEidBase,
	TEvents extends EventBase,
	TContext extends ContextBase>
	implements ICanStateChange<TSTATEid, TEvents>,
			   ICanStatesRegister<TSTATEid, TEvents, TContext> {

	get current():IState<TSTATEid, TEvents> | null {
		return this._current;
	}

	private readonly _stateProviders:Map<TSTATEid, () => IState<TSTATEid, TEvents>>        = new Map();
	private readonly _transitions:Map<TSTATEid, Transition<TSTATEid, TEvents, TContext>[]> = new Map();
	private _transitionStrategy:ITransitionStrategy<TSTATEid, TEvents>;
	private _overlayStrategyProvider:OverlayTransitionProvider<TSTATEid, TEvents>;
	private _onTransition?:Transition<TSTATEid, TEvents, TContext>;
	private _current:IState<TSTATEid, TEvents> | null                                      = null;
	private readonly _context:TContext;

	protected constructor(
		context:TContext,
		transitionStrategy?:ITransitionStrategy<TSTATEid, TEvents>,
		overlayStrategyProvider?:OverlayTransitionProvider<TSTATEid, TEvents>
	) {
		this._context                 = context;
		this._transitionStrategy      = transitionStrategy || new TransitionStrategy();
		this._overlayStrategyProvider = overlayStrategyProvider || overlayStrategiesProvider;
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

	async init(stateId:TSTATEid, payload?:TEvents[keyof TEvents]):Promise<boolean> {
		if(this._current) {
			return this._current.stateId == stateId;
		}

		const initialState = this._createState(stateId);
		if(!initialState) {
			return false;
		}

		await initialState.enter(payload);

		initialState.start();

		this._current = initialState;

		return true;
	}

	async destroy():Promise<void> {
		if(!this._current) {
			return;
		}

		this._current.stop();

		await this._current.exit();

		this._current = null;
	}

	async handle(event:keyof TEvents,
				 payload?:TEvents[keyof TEvents]):Promise<HandleEventTransitionResult<TSTATEid>> {

		if(!this._current) {
			throw new StateMachineHandleEventError(`State machine not initialized yet!`);
		}

		const transition = this._findTransition(event, this._current.stateId);
		if(!transition) {
			throw new StateMachineHandleEventError(`Transition for event '${String(event)}' not found.`);
		}

		const checkResult = checkTransitionPermit(this._current, event, transition,
												  this._stateProviders.has, this._context,
												  this._onTransition);
		if(checkResult !== true) {
			return checkResult;
		}

		if(this._onTransition) {
			//TODO: implement current transition cancellation and remove this: @see checkTransitionPermit
			await Promise.resolve();
		}

		this._onTransition = transition;

		// do a specified action before transition starts
		transition.action?.(this._context, payload);

		// transition block:
		const transitionStrategy = resolveTransitionStrategy(this._current, transition,
															 this._transitionStrategy,
															 this._overlayStrategyProvider);
		try {
			/*this._current || this._overlays.push()*/ = await transitionStrategy.doTransition(
				this._current,
				transition.toStateId,
				this._createState.bind(this),
				payload
			);
		}
		catch(e) {
			throw new StateMachineTransitionError(transition.toStateId,
												  `The transition from '${this._current.stateId}' to '${transition.toStateId}' was permitted, but an error occurred!`,
												  e);
		}

		delete this._onTransition;

		return { triggerEvent: String(event), result: "success", };
	}

	private _createState(stateId:TSTATEid):IState<TSTATEid, TEvents> {
		const stateProvider = this._stateProviders.get(stateId);
		if(!stateProvider) {
			throw new StateMachineTransitionError(stateId,
												  `Cannot find state '${stateId}' provider! Possibly state '${stateId}' have not been registered at state machine.`);
		}
		return stateProvider();
	}

	private _findTransition<K extends TSTATEid>(
		event:keyof TEvents,
		fromStateId:K
	):TransitionWithLinkedFromStateField<K, TSTATEid, TEvents, TContext> | null {
		const list = this._transitions.get(fromStateId);
		if(!list || !list.length) {
			return null;
		}
		for(const transition of list) {
			if(transition.onEvent == event) {
				return transition as TransitionWithLinkedFromStateField<K, TSTATEid, TEvents, TContext>;
			}
		}
		return null;
	}

}