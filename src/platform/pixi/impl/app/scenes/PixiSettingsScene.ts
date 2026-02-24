/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: PixiSettingsScene.ts
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
import type { Settings }           from "app/state/types";

export class PixiSettingsScene
	extends PixiSceneImpl<Settings.SceneId, Settings.SceneLayerId, Settings.SceneViewsId> {

	constructor(
		assetsBundles:IAssetsBundle[],
		viewImplProvider:Settings.ViewImplProvider<PixiViewImpl<Settings.SceneViewsId>>,
	) {
		super("SETTINGS",
			  AppSceneLayers[AppSceneID.SETTINGS],
			  AppSceneLayersStructure[AppSceneID.SETTINGS],
			  assetsBundles,
			  viewImplProvider);
	}
}
