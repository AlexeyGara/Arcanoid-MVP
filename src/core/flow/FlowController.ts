/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: FlowController.ts
 * Path: src/core/flow/
 * Author: alexeygara
 * Last modified: 2026-01-22 22:26
 */

import type {
	IEventBus,
	IEventDispatcher,
	IEventEmitter
}                                     from "@core-api/event-types";
import type { IFlowProcessStartStop } from "@core-api/flow-types";
import type {
	HandleEventTransitionResult,
	IStateMachine,
	IStatesFactory,
	StateProvider,
	TransitionWithLinkedFromStateField
}                                     from "@core-api/fsm-types";

export abstract class FlowController<TSTATEid extends STATEidBase,
	TEvents extends EventBase,
	TContext extends ContextBase>
	implements IFlowProcessStartStop {

	private readonly _eventBus:IEventBus<TEvents>;
	private readonly _stateMachine:IStateMachine<TSTATEid, TEvents, TContext>;
	private readonly _statesFactory:IStatesFactory<TSTATEid, TEvents>;
	private readonly _disposers:Array<() => void> = [];

	protected get eventDispatcher():IEventDispatcher<TEvents> {
		return this._eventBus;
	}

	protected get eventEmitter():IEventEmitter<TEvents> {
		return this._eventBus;
	}

	protected constructor(
		eventBus:IEventBus<TEvents>,
		stateMachine:IStateMachine<TSTATEid, TEvents, TContext>,
		statesFactory:IStatesFactory<TSTATEid, TEvents>
	) {
		this._eventBus      = eventBus;
		this._stateMachine  = stateMachine;
		this._statesFactory = statesFactory;
		this.registerStatesAndTransitions(this._register);
	}

	async start():Promise<void> {
		if(this._disposers.length > 0) {
			logger.warn(`Double start of flow controller!`);
			return Promise.resolve();
		}

		await this.beforeStart?.();

		// register events - subscribe
		this._disposers.push(...this.registerEvents(this._addEventHandler));

		// initialize state machine - switch state machine to initial state
		return this._stateMachine.init(...this.getInitialStateId()).then((success:boolean) => {
			if(success) {
				this.onStart();
			}
			else {
				this.emitFatalError(
					new Error(`[Flow Controller::start] Cannot initialize the state machine!`));
			}
		}).catch((e) => {
			this.emitFatalError(
				new Error(`[Flow Controller::start] Cannot initialize the state machine by reason: '${e}'`));
		});
	}

	protected beforeStart?():Promise<void>;

	protected abstract getInitialStateId():[stateId:TSTATEid, payload:TEvents[keyof TEvents]];

	protected abstract onStart():void;

	stop():Promise<void> {
		if(this._disposers.length == 0) {
			logger.warn(`Double stop of flow controller!`);
			return Promise.resolve();
		}

		// unsubscribe by registered events
		this._disposers.forEach(dispose => dispose());
		this._disposers.length = 0;

		// deinitialize state machine - stop and exit current state
		return this._stateMachine.destroy().then(() => {
			this.onStop();
		}).catch((e) => {
			this.emitFatalError(
				new Error(`[Flow Controller::stop] Cannot deinitialize state machine by reason: '${e}'`));
		});
	}

	protected abstract onStop():void;

	protected abstract emitFatalError(error:Error):void;

	protected abstract onTransitionCompleted?(event:keyof TEvents):void;

	protected abstract onTransitionBlocked(blockedEvent:keyof TEvents, fromState?:TSTATEid, toState?:TSTATEid):void;

	protected abstract onTransitionInterrupted(interruptByEvent:keyof TEvents, fromState?:TSTATEid, toState?:TSTATEid,
											   byState?:TSTATEid):void;

	protected abstract registerStatesAndTransitions<K extends TSTATEid>(
		doRegister:(
			stateId:K,
			transitions:Readonly<TransitionWithLinkedFromStateField<K, TSTATEid, TEvents, TContext>[]>
		) => void
	):void;

	private _register<K extends TSTATEid>(
		stateId:K,
		transitions:Readonly<TransitionWithLinkedFromStateField<K, TSTATEid, TEvents, TContext>[]>
	):void {
		// register state
		this._stateMachine.registerState(stateId, this._getStateProvider(stateId));

		// register gameTransitions for state from
		this._stateMachine.registerTransitions(stateId, transitions);
	}

	private _getStateProvider<K extends TSTATEid>(stateId:K):StateProvider<K, TEvents> {
		return this._statesFactory.getStateProvider(stateId);
	}

	protected abstract registerEvents(
		addHandler:(event:keyof TEvents) => EventHandlerDisposer
	):Array<() => void>;

	private _addEventHandler(event:keyof TEvents):EventHandlerDisposer {
		return this._eventBus.on(event, (payload:TEvents[typeof event]) => {
			this._stateMachine.handle(event, payload).then(
				(result:HandleEventTransitionResult<TSTATEid>) => {
					switch(result.result) {
						case "success":
							this.onTransitionCompleted?.(event);
							return;
						case "blocked":
							this.onTransitionBlocked(result.triggerEvent, result.fromStateId, result.toStateId);
							return;
						case "interrupted":
							this.onTransitionInterrupted(result.triggerEvent, result.interrupted?.fromStateId,
														 result.interrupted?.toStateId, result.interruptedBy);
							return;
						default:
							assertNever(result.result);
					}
				}
			).catch((e) => {
				this.emitFatalError(e);
			});
		});
	}

}