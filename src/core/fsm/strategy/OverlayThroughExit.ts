/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: OverlayExitStrategy.ts
 * Path: src/core/fsm/strategy/
 * Author: alexeygara
 * Last modified: 2026-02-21 14:59
 */

import type {
	IState,
	ITransitionStrategy
} from "@core-api/fsm-types";

export class OverlayThroughExit<TSTATEid extends STATEidBase, TEvents extends EventBase>

	implements ITransitionStrategy<TSTATEid, TEvents> {

	async doTransition(
		statesToExit:IState<TSTATEid, TEvents>[],
		newOverlayState:IState<TSTATEid, TEvents>,
		eventPayload:TEvents[keyof TEvents]
	):Promise<void> {

		// exit from state that is overlapping:

		for(const state of statesToExit) {
			state.stop();
		}

		for(const state of statesToExit) {
			await state.exit();
		}

		// start overlay-state:

		await newOverlayState.attach();

		await newOverlayState.enter(eventPayload);

		newOverlayState.start();
	}

}