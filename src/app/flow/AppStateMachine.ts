/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: AppStateMachine.ts
 * Path: src/app/flow/
 * Author: alexeygara
 * Last modified: 2026-02-21 19:53
 */

import type { AppContext }           from "@app-api/app-types";
import type { AppEvent }             from "app/event/events";
import type { AppSTATEid }           from "app/state/states";
import { StateMachine }              from "core/fsm/StateMachine";
import { OverlayClose }              from "core/fsm/strategy/OverlayClose";
import { overlayStrategiesProvider } from "core/fsm/strategy/strategies";
import { TransitionStrategy }        from "core/fsm/strategy/TransitionStrategy";

export class AppStateMachine extends StateMachine<AppSTATEid, AppEvent, AppContext> {

	constructor(
		context:AppContext
	) {
		const transitionStrategy      = new TransitionStrategy<AppSTATEid, AppEvent>();
		const overlayStrategyProvider = overlayStrategiesProvider<AppSTATEid, AppEvent>;
		const overlayCloseStrategy    = new OverlayClose<AppSTATEid, AppEvent>();

		super(context,
			  transitionStrategy,
			  overlayStrategyProvider,
			  overlayCloseStrategy);
	}
}