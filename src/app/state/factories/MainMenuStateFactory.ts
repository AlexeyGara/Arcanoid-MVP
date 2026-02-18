/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: MainMenuStateFactory.ts
 * Path: src/app/state/factories/
 * Author: alexeygara
 * Last modified: 2026-02-21 21:42
 */

import type { AppContext }       from "@app-api/app-types";
import type { IAppStateFactory } from "@app-api/state-types";
import type { AppEvent }         from "app/event/events";
import { AppSceneID }            from "app/scene/scenes";
import type {
	CustomSceneId,
	CustomSceneLayerId,
	CustomSceneViewId
}                                from "app/state/main-menu-state-connecting-types";
import { AppSTATEid }            from "app/state/states";
import { StateContext }          from "core/fsm/state/StateContext";

export class MainMenuStateFactory implements IAppStateFactory<CustomSceneId, CustomSceneLayerId, CustomSceneViewId> {

	constructor() {
	}

	provideStateContext(
		appContext:AppContext
	):StateContext<AppSceneID, CustomSceneId, CustomSceneLayerId, CustomSceneViewId, AppEvent> {

		const [pauseManager, pauseManagerRelease] = appContext.systems.pause.provide(AppSTATEid.MAIN_MENU);

		return new StateContext(AppSceneID.MENU,
								pauseManager,
								[],
								null,
								undefined,
								undefined,
								() => {
									pauseManagerRelease();
								});
	}

}