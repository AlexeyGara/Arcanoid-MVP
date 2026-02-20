/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: scene-impl-types.ts
 * Path: src/api/core/
 * Author: alexeygara
 * Last modified: 2026-02-18 17:54
 */

import type { HaveInteraction } from "@core-api/input-types";
import type { ResizeInfo }      from "@core-api/service-types";

export interface ISceneImpl<TSceneLayersId extends SceneLayersIdBase, TSceneChildId extends SceneChildIdBase>
	extends HaveInteraction {

	addToLayer(childId:TSceneChildId, targetLayerId:TSceneLayersId):boolean;

	removeFromLayer(childId:TSceneChildId, targetLayerId:TSceneLayersId):boolean;

	removeFromParent(childId:TSceneChildId):void;

	/** preload all required own resources, etc. before creating scene */
	doPreload(progressCallback?:(progress:number) => void):Promise<boolean>;

	/** setup scene for displaying, initial scene's first preview */
	doCreate():Promise<void>;

	/** unload all own resources, etc. */
	doDestroy():Promise<void>;

	/** resize scene's root layers */
	onResize?(resize:ResizeInfo):void;
}

export interface ISceneImplFactory<TSceneId extends SceneIdBase> {

	createImpl<TSceneLayersId extends SceneLayersIdBase, TSceneChildId extends SceneChildIdBase>(
		sceneId:TSceneId
	):ISceneImpl<TSceneLayersId, TSceneChildId>;
}