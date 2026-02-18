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
}                             from "app/scene/scenes";
import type {
	CustomSceneId,
	CustomSceneLayerId,
	CustomSceneProps,
	CustomSceneTargetRootLayer
} from "app/state/main-menu-state-connecting-types";
import { Scene }              from "core/scene/SceneBase";

type SceneViewsId = '';

export class MainMenuScene extends Scene<CustomSceneId, CustomSceneProps, CustomSceneTargetRootLayer, CustomSceneLayerId, SceneViewsId> {


}