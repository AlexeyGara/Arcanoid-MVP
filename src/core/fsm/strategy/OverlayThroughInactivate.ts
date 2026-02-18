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

export class OverlayThroughInactivate<TSTATEid extends STATEidBase, TEvents extends EventBase>
	implements ITransitionStrategy<TSTATEid, TEvents> {

	constructor() {
	}

	async doTransition(
		statesToStop:IState<TSTATEid, TEvents>[],
		newOverlayState:IState<TSTATEid, TEvents>,
		eventPayload:TEvents[keyof TEvents]
	):Promise<void> {

		// stop the state that is overlapping:

		for(const state of statesToStop) {
			state.stop();
		}

		// start overlay-state:

		await newOverlayState.attach();

		await newOverlayState.enter(eventPayload);

		newOverlayState.start();
	}

}