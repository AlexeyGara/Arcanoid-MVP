/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: MainMenuScene.ts
 * Path: src/app/structure/mainmenu/
 * Author: alexeygara
 * Last modified: 2026-02-20 23:55
 */

import type {
	AppScene,
	AppSceneID
}                from "app/scene/scenes";
import { Scene } from "core/scene/SceneBase";

type SceneId = typeof AppSceneID.MENU;
type SceneProps = AppScene[SceneId];
type SceneTargetLayer = SceneProps["targetRootLayer"];
type SceneLayersId = SceneProps["sceneLayers"][number];
type SceneViewsId = '';

export class MainMenuScene extends Scene<SceneId, SceneProps, SceneTargetLayer, SceneLayersId, SceneViewsId> {


}