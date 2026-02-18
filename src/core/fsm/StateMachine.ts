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
	Transition,
	TransitionWithLinkedFromStateField
}                                       from "@core-api/fsm-types";
import { StateMachineHandleEventError } from "core/errors/flow/StateMachineHandleEventError";
import { StateMachineTransitionError }  from "core/errors/flow/StateMachineTransitionError";
import { TransitionStrategy }           from "core/fsm/TransitionStrategy";

export abstract class StateMachine<TSTATEid extends STATEidBase,
	TEvents extends EventBase,
	TContext extends ContextBase>
	implements ICanStateChange<TSTATEid, TEvents>,
			   ICanStatesRegister<TSTATEid, TEvents, TContext> {

	get current():IState<TSTATEid, TEvents> | null {
		return this._current;
	}

	private readonly _stateProviders:Map<TSTATEid, () => IState<TSTATEid, TEvents>> = new Map();
	private readonly _transitions:Map<TSTATEid, Transition<TSTATEid, TEvents, TContext>[]> = new Map();
	private _transitionStrategy:ITransitionStrategy<TSTATEid, TEvents>;
	private _onTransition:Transition<TSTATEid, TEvents, TContext> | null = null;
	private _current:IState<TSTATEid, TEvents> | null = null;
	private readonly _context:TContext;

	protected constructor(
		context:TContext,
		transitionStrategy?:ITransitionStrategy<TSTATEid, TEvents>,
	) {
		this._context = context;
		this._transitionStrategy = transitionStrategy || new TransitionStrategy();
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

		// find transition for handle current event [

		const transition = this._findTransition(event, this._current.stateId);

		if(!transition) {
			throw new StateMachineHandleEventError(`Transition for event '${String(event)}' not found.`);
		}

		// ]

		// check and resolve legal transition fails [

		if(this._onTransition) {
			if(!this._onTransition.canInterrupt) {
				return {
					triggerEvent: String(event),
					result: "blocked",
					fromStateId: this._onTransition.fromStateId,
					toStateId: this._onTransition.toStateId,
					info: `State machine is under transition from '${this._onTransition.fromStateId}' to '${this._onTransition.toStateId}' and cannot interrupt by event '${String(
						event)}'!`
				} as HandleEventTransitionResult<TSTATEid, "blocked">;
			}
			else {
				//TODO: implement current transition cancellation
				return {
					triggerEvent: String(event),
					result: "blocked",
					fromStateId: this._onTransition.fromStateId,
					toStateId: this._onTransition.toStateId,
					info: `State machine is under transition from '${this._onTransition.fromStateId}' to '${this._onTransition.toStateId}' and cannot interrupt by event '${String(
						event)}'!`
				} as HandleEventTransitionResult<TSTATEid, "blocked">;
			}
		}

		if(!this._stateProviders.has(transition.toStateId)) {
			return {
				triggerEvent: String(event),
				result: "blocked",
				fromStateId: this._current.stateId,
				toStateId: transition.toStateId,
				info: `State '${transition.toStateId}' have not been registered at state machine!`
			} as HandleEventTransitionResult<TSTATEid, "blocked">;
		}

		if(transition.guard && !transition.guard(this._context)) {
			return {
				triggerEvent: String(event),
				result: "blocked",
				fromStateId: this._current.stateId,
				toStateId: transition.toStateId,
				info: `Transition to state '${transition.toStateId}' blocked by guard.`
			} as HandleEventTransitionResult<TSTATEid, "blocked">;
		}

		// ]

		this._onTransition = transition;

		// do a specified action before transition starts [

		transition.action?.(this._context, payload);

		// ]

		// transition block [

		this._current = await this._transitionStrategy.doTransition(
			this._current,
			transition.toStateId,
			this._createState.bind(this),
			payload
		);

		if(!this._current) {
			throw new StateMachineTransitionError(transition.toStateId);
		}

		// ] transition block

		this._onTransition = null;

		return {
			triggerEvent: String(event),
			result: "success",
		} as HandleEventTransitionResult<TSTATEid, "success">;
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