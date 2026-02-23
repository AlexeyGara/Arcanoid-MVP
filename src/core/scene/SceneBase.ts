/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: SceneBase.ts
 * Path: src/core/scene/
 * Author: alexeygara
 * Last modified: 2026-02-18 17:44
 */

import type { ErrorEventsEmitter } from "@core-api/event-types";
import type {
	IGameLoopUpdatable,
	IGameLoopUpdater
}                                  from "@core-api/gameloop-types";
import type { ISceneImpl }         from "@core-api/scene-impl-types";
import type {
	ISceneHost,
	IScenesManagerControlled
}                                  from "@core-api/scene-types";
import type {
	IResizable,
	ResizeInfo
}                                  from "@core-api/service-types";
import type { CanBeAddToScene }    from "@core-api/view-types";

// eslint-disable-next-line @typescript-eslint/naming-convention
const ESceneStatus = {
	NEW:        0,
	PRELOADING: 1,
	LOADED:     2,
	CREATED:    3,
	DESTROYED:  -1
} as const;

type ESceneStatus = typeof ESceneStatus[keyof typeof ESceneStatus];

export abstract class Scene<TSceneId extends SceneIdBase,
	TSceneProps extends SceneIdPropsBase<TTargetLayerId>,
	TTargetLayerId extends SceneLayersIdBase,
	TSceneLayersId extends SceneLayersIdBase,
	TSceneChildId extends SceneChildIdBase>

	implements IScenesManagerControlled<TSceneId, TSceneProps, TTargetLayerId>,
			   ISceneHost<TSceneLayersId, TSceneChildId>,
			   IResizable {

	readonly sceneId:TSceneId;
	readonly sceneProps:TSceneProps;

	@final
	get cacheable():boolean {
		return this.sceneProps.cacheable || false;
	}

	@final
	get targetLayerId():TTargetLayerId {
		return this.sceneProps.targetRootLayer;
	}

	@final
	get destroyed():boolean {
		return this._status == ESceneStatus.DESTROYED;
	}

	private readonly _gameLoop:IGameLoopUpdater;
	private readonly _sceneImpl:ISceneImpl<TSceneId, TSceneLayersId, TSceneChildId>;
	protected readonly errorEmitter:ErrorEventsEmitter;
	private _status:ESceneStatus = ESceneStatus.NEW;

	protected constructor(
		sceneId:TSceneId,
		props:TSceneProps,
		gameLoop:IGameLoopUpdater,
		sceneImpl:ISceneImpl<TSceneId, TSceneLayersId, TSceneChildId>,
		errorThrower:ErrorEventsEmitter,
	) {
		this.sceneId      = sceneId;
		this.sceneProps   = props;
		this._gameLoop    = gameLoop;
		this._sceneImpl   = sceneImpl;
		this.errorEmitter = errorThrower;
	}

	@final
	add(view:CanBeAddToScene<TSceneLayersId, TSceneChildId>):void {

		if(this._sceneImpl.addToLayer(view.uniqueOwnId, view.targetLayerId)) {
			return;
		}

		this.errorEmitter.emitFatalErrorEvent(new Error(
			`[Scene] cannot add view '${view.uniqueOwnId}' to layer '${view.targetLayerId}' of scene '${this.sceneId}'!`));
	}

	@final
	remove(view:CanBeAddToScene<TSceneLayersId, TSceneChildId>):void {

		if(this._sceneImpl.removeFromLayer(view.uniqueOwnId, view.targetLayerId)) {
			return;
		}

		//this._errorThrower.throwFatalErrorEvent(new Error(
		logger.warn(
			`[Scene] cannot remove view '${view.uniqueOwnId}' from layer '${view.targetLayerId}' of scene '${this.sceneId}'!`
		);
		//);

		this._sceneImpl.removeFromParent(view.uniqueOwnId);
	}

	@final
	addToUpdateLoop(...updatableList:IGameLoopUpdatable[]):void {
		for(const updatable of updatableList) {
			this._gameLoop.add(updatable);
		}
	}

	@final
	removeFromUpdateLoop(...updatableList:IGameLoopUpdatable[]):void {
		for(const updatable of updatableList) {
			this._gameLoop.remove(updatable);
		}
	}

	@final
	async preload():Promise<boolean> {
		if(this._status != ESceneStatus.NEW) {
			return false;
		}

		this._status = ESceneStatus.PRELOADING;

		const preloadSuccess = await this._sceneImpl.doPreload(this.onPreloadProgress?.bind(this));
		if(preloadSuccess) {
			this._status = ESceneStatus.LOADED;
			return true;
		}

		this._status = ESceneStatus.NEW;
		return false;
	}

	protected onPreloadProgress?(progress:number):void;

	@final
	async create():Promise<void> {
		if(this._status == ESceneStatus.LOADED) {
			await this._sceneImpl.doCreate();
			this._status = ESceneStatus.CREATED;
		}
	}

	@final
	destroy():void {
		if(this._status != ESceneStatus.DESTROYED) {
			void this._sceneImpl.doDestroy();
			this._status = ESceneStatus.DESTROYED;
		}
	}

	/** enable user inputs globally for current scene, etc. */
	@final
	enableInput():void {
		this._sceneImpl.enableInteraction();
	}

	/** disable user inputs globally for current scene, etc. */
	@final
	disableInput():void {
		this._sceneImpl.disableInteraction();
	}

	@final
	onResize = (resize:ResizeInfo):void => {
		this._sceneImpl.onResize?.(resize);
	};
}
