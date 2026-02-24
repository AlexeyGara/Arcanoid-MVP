/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: PixiGameScene.ts
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
import type { Game }               from "app/state/types";

export class PixiGameScene
	extends PixiSceneImpl<Game.SceneId, Game.SceneLayerId, Game.SceneViewsId> {

	constructor(
		assetsBundles:IAssetsBundle[],
		viewImplProvider:Game.ViewImplProvider<PixiViewImpl<Game.SceneViewsId>>,
	) {
		super("GAME",
			  AppSceneLayers[AppSceneID.GAME],
			  AppSceneLayersStructure[AppSceneID.GAME],
			  assetsBundles,
			  viewImplProvider);
	}
}
