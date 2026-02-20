/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: TransitionStrategy.ts
 * Path: src/core/fsm/strategy/
 * Author: alexeygara
 * Last modified: 2026-02-18 10:12
 */

import type {
	IState,
	ITransitionStrategy
} from "@core-api/fsm-types";

export class TransitionStrategy<TSTATEid extends STATEidBase, TEvents extends EventBase>
	implements ITransitionStrategy<TSTATEid, TEvents> {

	constructor() {
	}

	async doTransition(
		fromState:IState<TSTATEid, TEvents>,
		toState:IState<TSTATEid, TEvents>,
		eventPayload?:TEvents[keyof TEvents]
	):Promise<void> {

		fromState.stop();

		this.stopCurrentState(currentState);
		this.stopOverlayStates(overlayStates);

		const nextState = this.getNextState(nextStateId, nextStateProvider);

		await this.enterNextState(nextState, eventPayload);

		await this.exitOverlayStates(overlayStates);
		await this.exitCurrentState(currentState);

		this.startNextState(nextState);

		return [nextState, []];
	}

	protected stopCurrentState(state:IState<TSTATEid, TEvents>):void {
		state.stop();
	}

	protected stopOverlayStates(states:Readonly<IState<TSTATEid, TEvents>[]>):void {
		for(const state of states) {
			state.stop();
		}
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

	protected exitOverlayStates(states:Readonly<IState<TSTATEid, TEvents>[]>):Promise<void> {
		const reversedStates = [...states].reverse();

		const waiters:Promise<void>[] = [];
		for(const state of reversedStates) {
			waiters.push(state.exit());
		}
		return Promise.all(waiters).then();
	}

	protected startNextState(state:IState<TSTATEid, TEvents>):void {
		state.start();
	}
}