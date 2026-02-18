/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: GamePlayState.ts
 * Path: src/app/state/states/
 * Author: alexeygara
 * Last modified: 2026-02-21 21:13
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

type GamePlayStateId = typeof AppSTATEid.GAME_MODE;
type IsCritical = typeof AppStateIsCritical[GamePlayStateId];
type IsOverlay = typeof AppStateIsOverlay[GamePlayStateId];
type OverlayMode = typeof AppStateOverlayMode[GamePlayStateId];

export class GamePlayState extends StateBase<GamePlayStateId, AppEvent> {

	readonly critical:IsCritical     = true;
	readonly isOverlay:IsOverlay     = false;
	readonly overlayMode:OverlayMode = StateOverlayMode.PAUSE;

	constructor(
		stateContext:StateContext
	) {
		super(AppSTATEid.GAME_MODE,
			  stateContext);
	}
}