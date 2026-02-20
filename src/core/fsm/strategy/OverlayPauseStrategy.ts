/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: OverlayPauseStrategy.ts
 * Path: src/core/fsm/strategy/
 * Author: alexeygara
 * Last modified: 2026-02-19 22:14
 */

import type {
	IState,
	ITransitionStrategy
} from "@core-api/fsm-types";

export class OverlayPauseStrategy<TSTATEid extends STATEidBase, TEvents extends EventBase>
	implements ITransitionStrategy<TSTATEid, TEvents> {

	constructor() {
	}

	async doTransition(
		currentState:IState<TSTATEid, TEvents>,
		nextStateId:TSTATEid,
		nextStateProvider:(stateId:TSTATEid) => IState<TSTATEid, TEvents>,
		eventPayload?:TEvents[keyof TEvents]
	):Promise<IState<TSTATEid, TEvents>> {


	}
}