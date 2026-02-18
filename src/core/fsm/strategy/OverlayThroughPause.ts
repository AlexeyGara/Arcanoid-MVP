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

export class OverlayThroughPause<TSTATEid extends STATEidBase, TEvents extends EventBase>
	implements ITransitionStrategy<TSTATEid, TEvents> {

	constructor() {
	}

	async doTransition(
		statesToPause:IState<TSTATEid, TEvents>[],
		newOverlayState:IState<TSTATEid, TEvents>,
		eventPayload:TEvents[keyof TEvents]
	):Promise<void> {

		// pause the state that is overlapping:

		for(const state of statesToPause) {
			state.pause();
		}

		// start overlay-state:

		await newOverlayState.attach();

		await newOverlayState.enter(eventPayload);

		newOverlayState.start();
	}
}