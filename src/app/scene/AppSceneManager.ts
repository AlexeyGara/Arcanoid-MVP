/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: AppSceneManager.ts
 * Path: src/app/scene/
 * Author: alexeygara
 * Last modified: 2026-02-22 00:10
 */

import type { IViewsHolderImpl } from "@core-api/scene-impl-types";
import type { IScenesFactory }   from "@core-api/scene-types";
import type { IResizeManager }   from "@core-api/service-types";
import type {
	AppRootLayersId,
	AppSceneID,
	AppSceneLayersIds,
	AppSceneProps
}                                from "app/scene/scenes";
import { SceneManager }          from "core/scene/SceneManager";

export class AppSceneManager extends SceneManager<AppSceneID, AppSceneProps<AppSceneID>, AppSceneLayersIds<AppSceneID>, SceneChildIdBase, AppRootLayersId> {

	constructor(
		factory:IScenesFactory<AppSceneID, AppSceneProps<AppSceneID>, AppRootLayersId, AppSceneLayersIds<AppSceneID>, SceneChildIdBase>,
		rootContainerImpl:IViewsHolderImpl<AppRootLayersId, AppSceneID>,
		resizeManager:IResizeManager
	) {
		super(factory,
			  rootContainerImpl,
			  resizeManager);
	}
}