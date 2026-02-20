/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: OverlayStrategy.ts
 * Path: src/core/fsm/strategy/
 * Author: alexeygara
 * Last modified: 2026-02-19 21:17
 */

import type {
	IState,
	ITransitionStrategy
} from "@core-api/fsm-types";

export class OverlayInactiveStrategy<TSTATEid extends STATEidBase, TEvents extends EventBase>
	implements ITransitionStrategy<TSTATEid, TEvents> {

	constructor() {
	}

	async doTransition(
		fromState:IState<TSTATEid, TEvents>,
		toState:IState<TSTATEid, TEvents>,
		eventPayload?:TEvents[keyof TEvents]
	):Promise<void> {

		fromState.stop();

		await toState.enter(eventPayload);

		toState.start();
	}

}