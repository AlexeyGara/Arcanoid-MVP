/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: MainMenuScene.ts
 * Path: src/app/structure/mainmenu/
 * Author: alexeygara
 * Last modified: 2026-02-20 23:55
 */

import type {
	MainMenu_SceneId,
	MainMenu_SceneLayerId,
	MainMenu_SceneProps,
	MainMenu_SceneTargetRootLayer
}                from "app/state/main-menu-state-connecting-types";
import { Scene } from "core/scene/SceneBase";

type SceneViewsId = '';

export class MainMenuScene extends Scene<MainMenu_SceneId, MainMenu_SceneProps, MainMenu_SceneTargetRootLayer, MainMenu_SceneLayerId, SceneViewsId> {


}