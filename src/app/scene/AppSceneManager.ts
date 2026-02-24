/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: AppSceneManager.ts
 * Path: src/app/scene/
 * Author: alexeygara
 * Last modified: 2026-02-22 00:10
 */

import type { IViewsHolderImpl } from "@core-api/scene-impl-types";
import type { IResizeManager }   from "@core-api/service-types";
import type { AppScenesFactory } from "app/scene/AppScenesFactory";
import type {
	AppRootLayersId,
	AppSceneID
}                                from "app/scene/scenes";
import { SceneManager }          from "core/scene/SceneManager";

export type AppSceneManager = SceneManager<AppSceneID, AppRootLayersId>;

export const AppSceneManager = SceneManager as new (
	scenesFactory:AppScenesFactory,
	rootContainerImpl:IViewsHolderImpl<AppRootLayersId, AppSceneID>,
	resizeManager:IResizeManager,
) => AppSceneManager;