/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: PixiWinScene.ts
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
import type { Win }                from "app/state/types";

export class PixiWinScene
	extends PixiSceneImpl<Win.SceneId, Win.SceneLayerId, Win.SceneViewsId> {

	constructor(
		assetsBundles:IAssetsBundle[],
		viewImplProvider:Win.ViewImplProvider<PixiViewImpl<Win.SceneViewsId>>,
	) {
		super("WIN",
			  AppSceneLayers[AppSceneID.WIN],
			  AppSceneLayersStructure[AppSceneID.WIN],
			  assetsBundles,
			  viewImplProvider);
	}
}
