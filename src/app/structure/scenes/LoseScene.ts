/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: LoseScene.ts
 * Path: src/app/structure/scenes/
 * Author: alexeygara
 * Last modified: 2026-02-24 15:32
 */

import type { IGameLoopUpdater } from "@core-api/gameloop-types";
import type {
	Lose_SceneId,
	Lose_SceneImpl,
	Lose_SceneLayerId,
	Lose_SceneProps,
	Lose_SceneTargetRootLayer,
	Lose_SceneViewsId
}                                from "app/state/types/connecting_types/lose-state-connecting-types";
import { Scene }                 from "core/scene/SceneBase";

export class LoseScene
	extends Scene<Lose_SceneId, Lose_SceneProps, Lose_SceneTargetRootLayer, Lose_SceneLayerId, Lose_SceneViewsId> {

	constructor(
		gameLoop:IGameLoopUpdater,
		sceneImpl:Lose_SceneImpl,
	) {
		super("LOSE",
			  {
				  boot_preload:    true,
				  cacheable:       true,
				  targetRootLayer: 'app-popup-layer'
			  },
			  gameLoop,
			  sceneImpl);
	}
}