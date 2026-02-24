/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: SettingsScene.ts
 * Path: src/app/structure/scenes/
 * Author: alexeygara
 * Last modified: 2026-02-24 15:32
 */

import type { IGameLoopUpdater } from "@core-api/gameloop-types";
import type {
	Settings_SceneId,
	Settings_SceneImpl,
	Settings_SceneLayerId,
	Settings_SceneProps,
	Settings_SceneTargetRootLayer,
	Settings_SceneViewsId
}                                from "app/state/types/connecting_types/settings-state-connecting-types";
import { Scene }                 from "core/scene/SceneBase";

export class SettingsScene
	extends Scene<Settings_SceneId, Settings_SceneProps, Settings_SceneTargetRootLayer, Settings_SceneLayerId, Settings_SceneViewsId> {

	constructor(
		gameLoop:IGameLoopUpdater,
		sceneImpl:Settings_SceneImpl,
	) {
		super("SETTINGS",
			  {
				  boot_preload:    false,
				  cacheable:       true,
				  targetRootLayer: 'app-popup-layer'
			  },
			  gameLoop,
			  sceneImpl);
	}
}