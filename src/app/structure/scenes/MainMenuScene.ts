/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: MainMenuScene.ts
 * Path: src/app/structure/scenes/
 * Author: alexeygara
 * Last modified: 2026-02-24 17:07
 */

import type { IGameLoopUpdater } from "@core-api/gameloop-types";
import type {
	Menu
}                                from "app/state/types/index";
import { Scene }                 from "core/scene/SceneBase";

export class MainMenuScene
	extends Scene<Menu.SceneId, Menu.SceneProps, Menu.SceneTargetRootLayer, Menu.SceneLayerId, Menu.SceneViewsId> {

	constructor(
		gameLoop:IGameLoopUpdater,
		sceneImpl:Menu.SceneImpl,
	) {
		super("MENU",
			  {
				  boot_preload:    true,
				  cacheable:       true,
				  targetRootLayer: 'app-common-layer'
			  },
			  gameLoop,
			  sceneImpl);
	}
}