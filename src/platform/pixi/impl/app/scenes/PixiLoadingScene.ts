/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: PixiLoadingScene.ts
 * Path: src/platform/pixi/scene/app/scenes/loading/
 * Author: alexeygara
 * Last modified: 2026-02-24 16:34
 */

import { AppSceneLayersStructure } from "@pixi/impl/app/scenes-layers";
import { PixiSceneImpl }           from "@pixi/impl/PixiSceneImpl";
import type { PixiViewImpl }       from "@pixi/impl/PixiViewImpl";
import type { IAssetsBundle }      from "@platform/engine/assets";
import {
	AppSceneID,
	AppSceneLayers
}                                  from "app/scene/scenes";
import type { Loading }            from "app/state/types";

export class PixiLoadingScene
	extends PixiSceneImpl<Loading.SceneId, Loading.SceneLayerId, Loading.SceneViewsId> {

	constructor(
		assetsBundles:IAssetsBundle[],
		viewImplProvider:Loading.ViewImplProvider<PixiViewImpl<Loading.SceneViewsId>>,
	) {
		super("LOADING",
			  AppSceneLayers[AppSceneID.LOADING],
			  AppSceneLayersStructure[AppSceneID.LOADING],
			  assetsBundles,
			  viewImplProvider);
	}
}
