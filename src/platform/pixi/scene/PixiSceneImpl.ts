/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: PixiSceneImpl.ts
 * Path: src/platform/pixi/scene/
 * Author: alexeygara
 * Last modified: 2026-02-18 17:53
 */

import type { ISceneImpl } from "@core-api/scene-impl-types";
import type {
	IDisposableNode,
	IHaveChildrenNodeUI
}                          from "@platform/engine/ui/nodes";

export class PixiSceneImpl<TSceneLayersId extends SceneLayersIdBase> implements ISceneImpl {

	private readonly _rootLayers:Map<TSceneLayersId, IHaveChildrenNodeUI & IDisposableNode>;

	constructor() {
	}

}