/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: OverlayCloseStrategy.ts
 * Path: src/core/fsm/strategy/
 * Author: alexeygara
 * Last modified: 2026-02-20 19:28
 */

import type {
	IState,
	ITransitionStrategy
}                           from "@core-api/fsm-types";
import { StateOverlayMode } from "core/fsm/state/StateOverlayMode";

export class OverlayStateClose<TSTATEid extends STATEidBase, TEvents extends EventBase>
	implements ITransitionStrategy<TSTATEid, TEvents> {

	constructor() {
	}

	async doTransition(
		fromState:IState<TSTATEid, TEvents>,
		toState:IState<TSTATEid, TEvents>
	):Promise<void> {

		fromState.stop();

		await fromState.exit();

		switch(toState.overlayMode) {
			case StateOverlayMode.FORBIDDEN:
				return;

			case StateOverlayMode.INACTIVE:
				toState.start();
				return;

			case StateOverlayMode.PAUSE:
				toState.pauseManager.resume();
				toState.start();
				return;

			default:
				assertNever(toState.overlayMode);
		}
	}
}
