/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: LoadingGameState.ts
 * Path: src/app/state/states/
 * Author: alexeygara
 * Last modified: 2026-02-21 21:11
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

type LoadingGameStateId = typeof AppSTATEid.LOADING_GAME;
type IsCritical = typeof AppStateIsCritical[LoadingGameStateId];
type IsOverlay = typeof AppStateIsOverlay[LoadingGameStateId];
type OverlayMode = typeof AppStateOverlayMode[LoadingGameStateId];

export class LoadingGameState extends StateBase<LoadingGameStateId, AppEvent> {

	readonly critical:IsCritical     = true;
	readonly isOverlay:IsOverlay     = false;
	readonly overlayMode:OverlayMode = StateOverlayMode.FORBIDDEN;

	constructor(
		stateContext:StateContext
	) {
		super(AppSTATEid.LOADING_GAME,
			  stateContext);
	}
}