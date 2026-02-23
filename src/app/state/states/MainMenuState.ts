/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: MainMenuState.ts
 * Path: src/app/state/states/
 * Author: alexeygara
 * Last modified: 2026-02-21 20:01
 */

import type { AppEvent }     from "app/event/events";
import type { AppSceneID }   from "app/scene/scenes";
import type {
	MainMenu_IsCritical,
	MainMenu_IsOverlay,
	MainMenu_OverlayMode,
	MainMenu_SceneId,
	MainMenu_SceneLayerId,
	MainMenu_SceneViewId,
	MainMenu_StateId
}                            from "app/state/main-menu-state-connecting-types";
import { AppSTATEid }        from "app/state/states";
import { StateBase }         from "core/fsm/state/StateBase";
import type { StateContext } from "core/fsm/state/StateContext";
import { StateOverlayMode }  from "core/fsm/state/StateOverlayMode";

export class MainMenuState extends StateBase<MainMenu_StateId, AppEvent> {

	readonly critical:MainMenu_IsCritical  = false;
	readonly isOverlay:MainMenu_IsOverlay     = false;
	readonly overlayMode:MainMenu_OverlayMode = StateOverlayMode.INACTIVE;

	constructor(
		stateContext:StateContext<AppSceneID, MainMenu_SceneId, MainMenu_SceneLayerId, MainMenu_SceneViewId, AppEvent>
	) {
		super(AppSTATEid.MAIN_MENU,
			  stateContext as StateContext);
	}
}