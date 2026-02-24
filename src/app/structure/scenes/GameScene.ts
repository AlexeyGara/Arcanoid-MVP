/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: GameScene.ts
 * Path: src/app/structure/scenes/
 * Author: alexeygara
 * Last modified: 2026-02-24 17:07
 */

import type { IGameLoopUpdater } from "@core-api/gameloop-types";
import type { Game }             from "app/state/types/index";
import { Scene }                 from "core/scene/SceneBase";

export class GameScene
	extends Scene<Game.Game_SceneId, Game.Game_SceneProps, Game.Game_SceneTargetRootLayer, Game.Game_SceneLayerId, Game.Game_SceneViewsId> {

	constructor(
		gameLoop:IGameLoopUpdater,
		sceneImpl:Game_SceneImpl,
	) {
		super("GAME",
			  {
				  boot_preload:    false,
				  cacheable:       false,
				  targetRootLayer: 'app-common-layer'
			  },
			  gameLoop,
			  sceneImpl);
	}
}