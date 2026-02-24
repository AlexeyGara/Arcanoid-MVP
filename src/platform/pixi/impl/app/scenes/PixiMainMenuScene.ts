/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: PixiMainMenuScene.ts
 * Path: src/platform/pixi/scene/app/scenes/
 * Author: alexeygara
 * Last modified: 2026-02-24 15:32
 */

import { AppSceneLayersStructure } from "@pixi/impl/app/scenes-layers";
import { PixiSceneImpl }           from "@pixi/impl/PixiSceneImpl";
import type { PixiViewImpl }       from "@pixi/impl/PixiViewImpl";
import type { IAssetsBundle }      from "@platform/engine/assets";
import {
	AppSceneID,
	AppSceneLayers
}                                  from "app/scene/scenes";
import type { Menu }               from "app/state/types";

export class PixiMainMenuScene
	extends PixiSceneImpl<Menu.SceneId, Menu.SceneLayerId, Menu.SceneViewsId> {

	constructor(
		assetsBundles:IAssetsBundle[],
		viewImplProvider:Menu.ViewImplProvider<PixiViewImpl<Menu.SceneViewsId>>,
	) {
		super("MENU",
			  AppSceneLayers[AppSceneID.MENU],
			  AppSceneLayersStructure[AppSceneID.MENU],
			  assetsBundles,
			  viewImplProvider);
	}
}
