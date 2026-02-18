/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: scene-types.ts
 * Path: src/api/core/
 * Author: alexeygara
 * Last modified: 2026-02-18 09:21
 */

import type { IGameLoopUpdatable } from "@core-api/gameloop-types";
import type { CanBeAddToScene }    from "@core-api/module-types";
import type { IResizable }         from "@core-api/service-types";

export interface IViewsHolder<TTargetLayerId extends SceneLayersIdBase> {

	add(view:CanBeAddToScene<TTargetLayerId>):void;

	remove(view:CanBeAddToScene<TTargetLayerId>):void;
}

export interface ISceneHost<TRootLayerId extends SceneLayersIdBase>
	extends IViewsHolder<TRootLayerId> {

	readonly sceneId:SceneIdBase;

	addToUpdateLoop(...updatableList:IGameLoopUpdatable[]):void;

	removeFromUpdateLoop(...updatableList:IGameLoopUpdatable[]):void;
}

export interface IScenesManagerControlled<TSceneId extends SceneIdBase,
	TSceneProps extends SceneIdPropsBase<TTargetRootLayerId>,
	TTargetRootLayerId extends SceneLayersIdBase> {

	readonly targetLayerId:TTargetRootLayerId;

	readonly sceneId:TSceneId;
	readonly sceneProps:TSceneProps;
	readonly cacheable:boolean;
	readonly destroyed:boolean;

	/** preload all scene assets before create */
	preload():Promise<boolean>;

	/** create scene after resources was loaded */
	create():Promise<void>;

	enableInput():void;

	disableInput():void;

	destroy():Promise<void>;
}

export type SceneObject<TSceneId extends SceneIdBase,
	TSceneProps extends SceneIdPropsBase<TTargetRootLayerId>,
	TTargetRootLayerId extends SceneLayersIdBase,
	TSceneLayersId extends SceneLayersIdBase>
	= ISceneHost<TSceneLayersId>
	  & IScenesManagerControlled<TSceneId, TSceneProps, TTargetRootLayerId>
	  & IResizable;

export interface IScenesFactory<TSceneId extends SceneIdBase,
	TSceneProps extends SceneIdPropsBase<TTargetRootLayerId>,
	TTargetRootLayerId extends SceneLayersIdBase> {

	createScene<TCustomSceneId extends TSceneId, TSceneLayersId extends SceneLayersIdBase>(
		sceneId:TCustomSceneId,
		sceneRootLayers:RootLayersStructure<TSceneLayersId>
	):SceneObject<TCustomSceneId, TSceneProps, TTargetRootLayerId, TSceneLayersId>;
}

export interface IScenesManager<TSceneId extends SceneIdBase> {

	isActive(sceneId:TSceneId):boolean;

	show<TCustomSceneId extends TSceneId, TSceneLayersId extends SceneLayersIdBase>(
		sceneId:TCustomSceneId,
		sceneLayers:RootLayersStructure<TSceneLayersId>
	):Promise<ISceneHost<TSceneLayersId>>;

	hide<TSceneLayersId extends SceneLayersIdBase>(
		scene:ISceneHost<TSceneLayersId>
	):Promise<boolean>;

	isCached(sceneId:TSceneId):boolean;
}
