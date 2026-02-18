/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: MainMenuScene.ts
 * Path: src/platform/pixi/scene/app/scenes/
 * Author: alexeygara
 * Last modified: 2026-02-20 23:47
 */

import { PixiSceneImpl }       from "@pixi/scene/PixiSceneImpl";
import type { AppSceneLayers } from "app/scene/scenes";
import { AppSceneID }          from "app/scene/scenes";

type SceneId = typeof AppSceneID.MENU;
type SceneLayerId = typeof AppSceneLayers[SceneId];
type SceneViewsId = '';

export class MainMenuScene extends PixiSceneImpl<SceneId, SceneLayerId[number], SceneViewsId> {

	readonly sceneId = AppSceneID.MENU;

	
}