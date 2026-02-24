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
	MainMenu_SceneId,
	MainMenu_SceneImpl,
	MainMenu_SceneLayerId,
	MainMenu_SceneProps,
	MainMenu_SceneTargetRootLayer,
	MainMenu_SceneViewsId
}                                from "app/state/types/connecting_types/mainmenu-state-connecting-types";
import { Scene }                 from "core/scene/SceneBase";

export class MainMenuScene
	extends Scene<MainMenu_SceneId, MainMenu_SceneProps, MainMenu_SceneTargetRootLayer, MainMenu_SceneLayerId, MainMenu_SceneViewsId> {

	constructor(
		gameLoop:IGameLoopUpdater,
		sceneImpl:MainMenu_SceneImpl,
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