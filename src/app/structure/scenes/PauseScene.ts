/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: PauseScene.ts
 * Path: src/app/structure/scenes/
 * Author: alexeygara
 * Last modified: 2026-02-24 15:32
 */

import type { IGameLoopUpdater } from "@core-api/gameloop-types";
import type {
	Pause_SceneId,
	Pause_SceneImpl,
	Pause_SceneLayerId,
	Pause_SceneProps,
	Pause_SceneTargetRootLayer,
	Pause_SceneViewsId
}                                from "app/state/types/connecting_types/pause-state-connecting-types";
import { Scene }                 from "core/scene/SceneBase";

export class PauseScene
	extends Scene<Pause_SceneId, Pause_SceneProps, Pause_SceneTargetRootLayer, Pause_SceneLayerId, Pause_SceneViewsId> {

	constructor(
		gameLoop:IGameLoopUpdater,
		sceneImpl:Pause_SceneImpl,
	) {
		super("PAUSE",
			  {
				  boot_preload:    true,
				  cacheable:       true,
				  targetRootLayer: 'app-popup-layer'
			  },
			  gameLoop,
			  sceneImpl);
	}
}