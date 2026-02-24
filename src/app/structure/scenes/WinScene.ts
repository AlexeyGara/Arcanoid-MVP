/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: WinScene.ts
 * Path: src/app/structure/scenes/
 * Author: alexeygara
 * Last modified: 2026-02-24 15:32
 */

import type { IGameLoopUpdater } from "@core-api/gameloop-types";
import type {
	Win_SceneId,
	Win_SceneImpl,
	Win_SceneLayerId,
	Win_SceneProps,
	Win_SceneTargetRootLayer,
	Win_SceneViewsId
}                                from "app/state/types/connecting_types/win-state-connecting-types";
import { Scene }                 from "core/scene/SceneBase";

export class WinScene
	extends Scene<Win_SceneId, Win_SceneProps, Win_SceneTargetRootLayer, Win_SceneLayerId, Win_SceneViewsId> {

	constructor(
		gameLoop:IGameLoopUpdater,
		sceneImpl:Win_SceneImpl,
	) {
		super("WIN",
			  {
				  boot_preload:    true,
				  cacheable:       true,
				  targetRootLayer: 'app-common-layer'
			  },
			  gameLoop,
			  sceneImpl);
	}
}