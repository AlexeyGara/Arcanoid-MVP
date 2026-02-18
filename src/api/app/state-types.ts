/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: state-types.ts
 * Path: src/api/app/
 * Author: alexeygara
 * Last modified: 2026-02-21 21:46
 */

import type { AppContext }   from "@app-api/app-types";
import type { AppEvent }     from "app/event/events";
import type {
	AppSceneID,
	AppSceneLayers
}                            from "app/scene/scenes";
import type { StateContext } from "core/fsm/state/StateContext";

export interface IAppStateFactory<TCustomSceneId extends AppSceneID,
	TSceneLayersId extends typeof AppSceneLayers[TCustomSceneId][number],
	TSceneChildrenId extends SceneChildIdBase> {

	provideStateContext(
		appContext:AppContext
	):StateContext<AppSceneID, TCustomSceneId, TSceneLayersId, TSceneChildrenId, AppEvent>;

}