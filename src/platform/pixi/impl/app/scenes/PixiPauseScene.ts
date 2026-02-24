/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: PixiPauseScene.ts
 * Path: src/platform/pixi/scene/app/scenes/
 * Author: alexeygara
 * Last modified: 2026-02-24 17:07
 */

import { AppSceneLayersStructure } from "@pixi/impl/app/scenes-layers";
import { PixiSceneImpl }           from "@pixi/impl/PixiSceneImpl";
import type { PixiViewImpl }       from "@pixi/impl/PixiViewImpl";
import type { IAssetsBundle }      from "@platform/engine/assets";
import {
	AppSceneID,
	AppSceneLayers
}                                  from "app/scene/scenes";
import type { Pause }              from "app/state/types";

export class PixiPauseScene
	extends PixiSceneImpl<Pause.SceneId, Pause.SceneLayerId, Pause.SceneViewsId> {

	constructor(
		assetsBundles:IAssetsBundle[],
		viewImplProvider:Pause.ViewImplProvider<PixiViewImpl<Pause.SceneViewsId>>,
	) {
		super("PAUSE",
			  AppSceneLayers[AppSceneID.PAUSE],
			  AppSceneLayersStructure[AppSceneID.PAUSE],
			  assetsBundles,
			  viewImplProvider);
	}
}
