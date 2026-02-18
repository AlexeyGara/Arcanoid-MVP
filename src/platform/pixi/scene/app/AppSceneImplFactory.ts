/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: AppSceneImplFactory.ts
 * Path: src/platform/pixi/scene/app/
 * Author: alexeygara
 * Last modified: 2026-02-20 23:38
 */

import type {
	ISceneImpl,
	ISceneImplFactory
}                          from "@core-api/scene-impl-types";
import type { AppSceneID } from "app/scene/scenes";

export class AppSceneImplFactory implements ISceneImplFactory<AppSceneID> {

	constructor() {
	}

	createImpl<TSceneLayersId extends SceneLayersIdBase, TSceneChildId extends SceneChildIdBase>(
		sceneId:AppSceneID
	):ISceneImpl<TSceneLayersId, TSceneChildId> {
		return undefined;
	}
}