/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Chesstles-TS
 * File: TransitionStrategy.ts
 * Path: src/core/fsm/
 * Author: alexeygara
 * Last modified: 2026-01-20 20:14
 */

import type {
	IState,
	ITransitionStrategy
} from "@core-api/fsm-types";

export class TransitionStrategy<TSTATEid extends STATEidBase,
	TEvents extends EventBase>
	implements ITransitionStrategy<TSTATEid, TEvents> {

	async doTransition(
		currentState:IState<TSTATEid, TEvents>,
		nextStateId:TSTATEid,
		nextStateProvider:(stateId:TSTATEid) => IState<TSTATEid, TEvents>,
		eventPayload?:TEvents[keyof TEvents]
	):Promise<IState<TSTATEid, TEvents>> {

		this.stopCurrentState(currentState);

		const nextState = this.getNextState(nextStateId, nextStateProvider);

		await this.enterNextState(nextState, eventPayload);

		await this.exitCurrentState(currentState);

		this.startNextState(nextState);

		return nextState;
	}

	protected stopCurrentState(state:IState<TSTATEid, TEvents>):void {
		state.stop();
	}

	protected getNextState(stateId:TSTATEid,
						   stateProvider:(stateId:TSTATEid) => IState<TSTATEid, TEvents>):IState<TSTATEid, TEvents> {
		return stateProvider(stateId);
	}

	protected async enterNextState(state:IState<TSTATEid, TEvents>,
								   eventPayload?:TEvents[keyof TEvents]):Promise<void> {
		await state.enter(eventPayload);
	}

	protected async exitCurrentState(state:IState<TSTATEid, TEvents>):Promise<void> {
		await state.exit();
	}

	protected startNextState(state:IState<TSTATEid, TEvents>):void {
		state.start();
	}
}