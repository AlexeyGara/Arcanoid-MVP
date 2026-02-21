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

export class OverlayClose<TSTATEid extends STATEidBase, TEvents extends EventBase>

	implements ITransitionStrategy<TSTATEid, TEvents> {

	constructor() {
	}

	async doTransition(
		overlayStatesToClose:IState<TSTATEid, TEvents>[],
		stateToRestore:IState<TSTATEid, TEvents>,
		eventPayload:TEvents[keyof TEvents]
	):Promise<void> {

		// closing overlay-state/states:

		for(const overlayState of overlayStatesToClose) {
			overlayState.stop();
		}

		for(const overlayState of overlayStatesToClose) {
			await overlayState.exit();
		}

		for(const overlayState of overlayStatesToClose) {
			overlayState.detach();
		}

		// restoring state that was overlapped:

		switch(stateToRestore.overlayMode) {
			case StateOverlayMode.FORBIDDEN:
				return;

			case StateOverlayMode.PAUSE:
				stateToRestore.resume();

				return;

			case StateOverlayMode.INACTIVE:
				stateToRestore.start();

				return;

			case StateOverlayMode.EXIT:
				await stateToRestore.enter(eventPayload);

				stateToRestore.start();

				return;

			default:
				assertNever(stateToRestore.overlayMode);
		}
	}
}
