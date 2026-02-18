/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: GameWinState.ts
 * Path: src/app/state/states/
 * Author: alexeygara
 * Last modified: 2026-02-21 21:21
 */

import type { AppEvent }     from "app/event/events";
import type {
	AppStateIsCritical,
	AppStateIsOverlay,
	AppStateOverlayMode
}                            from "app/state/states";
import { AppSTATEid }        from "app/state/states";
import { StateBase }         from "core/fsm/state/StateBase";
import type { StateContext } from "core/fsm/state/StateContext";
import { StateOverlayMode }  from "core/fsm/state/StateOverlayMode";

type GameWinStateId = typeof AppSTATEid.WIN_SCREEN;
type IsCritical = typeof AppStateIsCritical[GameWinStateId];
type IsOverlay = typeof AppStateIsOverlay[GameWinStateId];
type OverlayMode = typeof AppStateOverlayMode[GameWinStateId];

export class GameWinState extends StateBase<GameWinStateId, AppEvent> {

	readonly critical:IsCritical     = true;
	readonly isOverlay:IsOverlay     = false;
	readonly overlayMode:OverlayMode = StateOverlayMode.INACTIVE;

	constructor(
		stateContext:StateContext
	) {
		super(AppSTATEid.WIN_SCREEN,
			  stateContext);
	}
}