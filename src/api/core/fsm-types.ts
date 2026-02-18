/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: аыь-ензуы.ts
 * Path: src/api/core/
 * Author: alexeygara
 * Last modified: 2026-02-18 09:17
 */

export interface IState<TCustomSTATEid extends STATEidBase, TEvents extends EventBase> {
	readonly stateId:TCustomSTATEid;

	/** Prepare state to activate - create scene, preload assets, attach modules view to scene, add modules to gameLoop live-circle, apply payload-data and preactivate modules, start fade-in action */
	enter(payload?:TEvents[keyof TEvents]):Promise<void>;

	/** Activate modules - finish fade-in action, activate controls, inputs, animations, etc. */
	start():void;

	/** Deactivate modules - start fade-out action, deactivate controls, inputs, animations, etc. */
	stop():void;

	/** Exit from state - Finish fade-out action, detach modules view from scene, remove modules from gameLoop live-circle */
	exit():Promise<void>;
}

export interface IStateEnterStrategy<TEvents extends EventBase> {

	doEnter(payload?:TEvents[keyof TEvents]):Promise<void>;
}

export interface IStateStartStrategy {

	doStart():void;
}

export interface IStateStopStrategy {

	doStop():void;
}

export interface IStateExitStrategy {

	doExit():Promise<void>;
}

export type StateProvider<TCustomSTATEid extends STATEidBase, TEvents extends EventBase> = () => IState<TCustomSTATEid, TEvents>;

export interface IStatesFactory<TSTATEid extends STATEidBase, TEvents extends EventBase> {
	getStateProvider<K extends TSTATEid>(stateId:K):StateProvider<K, TEvents>;
}

export type Transition<TSTATEid extends STATEidBase,
	TEvents extends EventBase,
	TContext extends ContextBase> = {
	/**
	 * StateId where transition started
	 * @[WARNING]: Do not rename this field
	 */
	readonly fromStateId:TSTATEid;
	readonly toStateId:TSTATEid;
	readonly onEvent:keyof TEvents;
	/**
	 * Guard for complete transition from state {@link fromStateId} to state {@link toStateId} by event {@link onEvent}
	 * - transition is allowed if return a 'true'
	 * - transition not allowed if return a 'false'
	 * @param context A global single-scope context object for utility usage.
	 */
	guard?:(context:TContext) => boolean;
	/**
	 * Action that will be executed before allowed transition is started.
	 * @param context A global single-scope context object for utility usage.
	 * @param payload A payload of current allowed transition.
	 */
	action?:(context:TContext, payload?:TEvents[keyof TEvents]) => void;
	/**
	 * Flag indicating whether this transition can be interrupted (before it will be completed) by another new transition.
	 */
	canInterrupt?:boolean;
}

export interface ITransitionStrategy<TSTATEid extends STATEidBase,
	TEvents extends EventBase> {

	doTransition(
		currentState:IState<TSTATEid, TEvents>,
		nextStateId:TSTATEid,
		nextStateProvider:(stateId:TSTATEid) => IState<TSTATEid, TEvents> | null,
		eventPayload?:TEvents[keyof TEvents]
	):Promise<IState<TSTATEid, TEvents>>;
}

type TransitionResult = "success" | "blocked" | "interrupted";

export type HandleEventTransitionResult<TSTATEid extends STATEidBase,
	TResult extends TransitionResult = TransitionResult> = {

	readonly triggerEvent:string;
	readonly result:TResult;
	readonly fromStateId?:TResult extends "blocked" ? TSTATEid : undefined;
	readonly toStateId?:TResult extends "blocked" ? TSTATEid : undefined;
	readonly interrupted?:TResult extends "interrupted" ? {
		readonly fromStateId:TSTATEid;
		readonly toStateId:TSTATEid;
		readonly onEvent:keyof EventBase;
	} : undefined;
	readonly interruptedBy?:TResult extends "interrupted" ? TSTATEid : undefined;
	readonly info?:string;
}

export interface ICanStatesRegister<TSTATEid extends STATEidBase,
	TEvents extends EventBase,
	TContext extends ContextBase> {

	registerState<K extends TSTATEid>(
		stateId:K,
		stateProvider:StateProvider<K, TEvents>
	):void;

	registerTransitions<K extends TSTATEid>(
		fromStateId:K,
		transitions:Readonly<TransitionWithLinkedFromStateField<K, TSTATEid, TEvents, TContext>[]>
	):void;
}

export interface ICanStateChange<TSTATEid extends STATEidBase,
	TEvents extends EventBase> {

	readonly current:IState<TSTATEid, TEvents> | null;

	init(stateId:TSTATEid):Promise<boolean>;

	handle(event:keyof TEvents, payload?:TEvents[keyof TEvents]):Promise<HandleEventTransitionResult<TSTATEid>>;

	destroy():Promise<void>;
}

export type IStateMachine<TSTATEid extends STATEidBase,
	TEvents extends EventBase,
	TContext extends ContextBase>
	= ICanStatesRegister<TSTATEid, TEvents, TContext> &
	  ICanStateChange<TSTATEid, TEvents>;

export type GetStateIDTypeFromState<TState extends IState<STATEidBase, EventBase>>
	= TState extends IState<infer TSTATEid, EventBase> ? TSTATEid : never;

export type GetPayloadTypeFromState<TState extends IState<STATEidBase, EventBase>>
	= TState extends IState<STATEidBase, infer TEvents> ? TEvents[keyof TEvents] : never;

export type GetEventsTypeFromTransition<TTransion extends Transition<STATEidBase, EventBase, ContextBase>>
	= TTransion extends Transition<STATEidBase, infer TEvents, ContextBase> ? TEvents : never;

export type ResolveEventPayload<TEvents extends Record<string, EventPayloadBase>>
	= TEvents extends Record<string, infer TPayload> ? TPayload : never;

type FromStateFieldKey = "fromStateId" extends keyof Transition<STATEidBase, EventBase, ContextBase> ? "fromStateId" : never; //"fromStateId"
type OtherFieldsKeys = Exclude<keyof Transition<STATEidBase, EventBase, ContextBase>, FromStateFieldKey>;

type SingleFromStateField<TCustomSTATEid extends STATEidBase>
	= { [P in FromStateFieldKey]:TCustomSTATEid };

type ExcludeFromStateField<TSTATEid extends STATEidBase,
	TEvents extends EventBase,
	TContext extends ContextBase,
	TTransition extends Transition<TSTATEid, TEvents, TContext> = Transition<TSTATEid, TEvents, TContext>>
	= Pick<TTransition, OtherFieldsKeys>;

export type TransitionWithLinkedFromStateField<TCustomSTATEid extends STATEidBase,
	TSTATEid extends STATEidBase,
	TEvents extends EventBase,
	TContext extends ContextBase>
	= SingleFromStateField<TCustomSTATEid> & ExcludeFromStateField<TSTATEid, TEvents, TContext>;

export type LinkedTransitionsList<TSTATEid extends STATEidBase,
	TEvents extends EventBase,
	TContext extends ContextBase>
	= { readonly [TCustomSTATEid in TSTATEid]:Readonly<Array<TransitionWithLinkedFromStateField<TCustomSTATEid, TSTATEid, TEvents, TContext>>> };
