/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: LoadingScene.ts
 * Path: src/app/structure/scenes/
 * Author: alexeygara
 * Last modified: 2026-02-24 15:32
 */

import type { IGameLoopUpdater } from "@core-api/gameloop-types";
import type {
	Loading_SceneId,
	Loading_SceneImpl,
	Loading_SceneLayerId,
	Loading_SceneProps,
	Loading_SceneTargetRootLayer,
	Loading_SceneViewsId
}                                from "app/state/types/connecting_types/loading-state-connecting-types";
import { Scene }                 from "core/scene/SceneBase";

export class LoadingScene
	extends Scene<Loading_SceneId, Loading_SceneProps, Loading_SceneTargetRootLayer, Loading_SceneLayerId, Loading_SceneViewsId> {

	constructor(
		gameLoop:IGameLoopUpdater,
		sceneImpl:Loading_SceneImpl,
	) {
		super("LOADING",
			  {
				  boot_preload:    true,
				  cacheable:       true,
				  targetRootLayer: 'app-loader-layer'
			  },
			  gameLoop,
			  sceneImpl);
	}
}