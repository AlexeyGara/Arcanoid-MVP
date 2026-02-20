/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: OverlayStrategyProvider.ts
 * Path: src/core/fsm/strategy/
 * Author: alexeygara
 * Last modified: 2026-02-19 22:01
 */

import type { ITransitionStrategy } from "@core-api/fsm-types";
import { StateOverlayMode }         from "core/fsm/state/StateOverlayMode";
import { OverlayForbiddenStrategy } from "core/fsm/strategy/OverlayForbiddenStrategy";
import { OverlayInactiveStrategy }  from "core/fsm/strategy/OverlayInactiveStrategy";
import { OverlayPauseStrategy }     from "core/fsm/strategy/OverlayPauseStrategy";

export const overlayStrategiesProvider = <TSTATEid extends STATEidBase, TEvents extends EventBase>(
	overlayMode:StateOverlayMode
):ITransitionStrategy<TSTATEid, TEvents> => {

	switch(overlayMode) {
		case StateOverlayMode.FORBIDDEN:
			return new OverlayForbiddenStrategy();

		case StateOverlayMode.INACTIVE:
			return new OverlayInactiveStrategy();

		case StateOverlayMode.PAUSE:
			return new OverlayPauseStrategy();

		default:
			assertNever(overlayMode);
	}
};