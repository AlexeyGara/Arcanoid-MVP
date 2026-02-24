/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: PixiLoseScene.ts
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
import type { Lose }               from "app/state/types";

export class PixiLoseScene
	extends PixiSceneImpl<Lose.SceneId, Lose.SceneLayerId, Lose.SceneViewsId> {

	constructor(
		assetsBundles:IAssetsBundle[],
		viewImplProvider:Lose.ViewImplProvider<PixiViewImpl<Lose.SceneViewsId>>,
	) {
		super("LOSE",
			  AppSceneLayers[AppSceneID.LOSE],
			  AppSceneLayersStructure[AppSceneID.LOSE],
			  assetsBundles,
			  viewImplProvider);
	}
}
