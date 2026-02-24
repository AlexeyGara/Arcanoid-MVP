/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: scene-types.ts
 * Path: src/api/core/
 * Author: alexeygara
 * Last modified: 2026-02-18 09:21
 */

import type { IGameLoopUpdatable } from "@core-api/gameloop-types";
import type { IResizable }         from "@core-api/service-types";
import type { CanBeAddToScene }    from "@core-api/view-types";

export interface IViewsHolder<TTargetLayerId extends SceneLayersIdBase, TViewId extends SceneChildIdBase> {

	add(view:CanBeAddToScene<TTargetLayerId, TViewId>):void;

	remove(view:CanBeAddToScene<TTargetLayerId, TViewId>):void;
}

export interface ISceneHost<TRootLayerId extends SceneLayersIdBase, TViewsId extends SceneChildIdBase>
	extends IViewsHolder<TRootLayerId, TViewsId> {

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

	destroy():void;
}

export type SceneObject<TSceneId extends SceneIdBase,
	TSceneProps extends SceneIdPropsBase<TTargetRootLayerId>,
	TTargetRootLayerId extends SceneLayersIdBase,
	TSceneLayersId extends SceneLayersIdBase,
	TSceneChildrenId extends SceneChildIdBase>
	= ISceneHost<TSceneLayersId, TSceneChildrenId>
	  & IScenesManagerControlled<TSceneId, TSceneProps, TTargetRootLayerId>
	  & IResizable;

export interface IScenesFactory<TSceneId extends SceneIdBase, TTargetRootLayerId extends SceneLayersIdBase> {

	createScene<TCustomSceneId extends TSceneId,
		TSceneProps extends SceneIdPropsBase<TTargetRootLayerId>,
		TSceneLayersId extends SceneLayersIdBase,
		TSceneChildrenId extends SceneChildIdBase>(
		sceneId:TCustomSceneId
	):SceneObject<TCustomSceneId,
		TSceneProps,
		TTargetRootLayerId,
		TSceneLayersId,
		TSceneChildrenId>;
}

export interface IScenesManager<TSceneId extends SceneIdBase> {

	isActive(sceneId:TSceneId):boolean;

	show<TCustomSceneId extends TSceneId, TSceneLayersId extends SceneLayersIdBase, TViewsId extends SceneChildIdBase>(
		sceneId:TCustomSceneId
	):Promise<ISceneHost<TSceneLayersId, TViewsId>>;

	hide<TSceneLayersId extends SceneLayersIdBase, TViewsId extends SceneChildIdBase>(
		scene:ISceneHost<TSceneLayersId, TViewsId>
	):boolean;

	isCached(sceneId:TSceneId):boolean;
}
