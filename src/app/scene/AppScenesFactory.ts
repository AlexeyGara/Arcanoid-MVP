/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: AppScenesFactory.ts
 * Path: src/app/scene/
 * Author: alexeygara
 * Last modified: 2026-02-22 00:43
 */

import type {
	IScenesFactory,
	SceneObject
}                     from "@core-api/scene-types";
import type {
	AppRootLayersId,
	AppSceneLayersIds,
	AppSceneProps
}                     from "app/scene/scenes";
import { AppSceneID } from "app/scene/scenes";

export class AppScenesFactory implements IScenesFactory<AppSceneID, AppSceneProps<AppSceneID>, AppRootLayersId, AppSceneLayersIds<AppSceneID>, SceneChildIdBase> {

	constructor() {
	}

	createScene<TCustomSceneId extends AppSceneID>(
		sceneId:TCustomSceneId
	):SceneObject<TCustomSceneId, AppSceneProps<AppSceneID>, AppRootLayersId, AppSceneLayersIds<AppSceneID>, SceneChildIdBase> {

		switch(sceneId) {

			case AppSceneID.MENU:

			case AppSceneID.LOADING:

			case AppSceneID.GAME:

			case AppSceneID.PAUSE:

			case AppSceneID.LOSE:

			case AppSceneID.WIN:

			case AppSceneID.SETTINGS:
				break;

			default:
				assertNever(sceneId);
		}
	}
}