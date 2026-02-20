/*
 * Copyright (c) Alexey Gara 2025.
 * "Chesstles-TS" project
 * Current file: "SceneManager.ts"
 * Last modified date: 28.12.2025, 10:58
 * All rights reserved.
 */

import type { ISceneImpl }      from "@core-api/scene-impl-types";
import type {
	ISceneHost,
	IScenesFactory,
	IScenesManager,
	IScenesManagerControlled,
	SceneObject
}                               from "@core-api/scene-types";
import type { IResizeManager }  from "@core-api/service-types";
import { ScenePreLoadingError } from "core/errors/flow/ScenePreLoadingError";

export abstract class SceneManager<TScenesId extends SceneIdBase,
	TSceneProps extends SceneIdPropsBase<TMainRootLayersId>,
	TMainRootLayersId extends SceneLayersIdBase>
	implements IScenesManager<TScenesId> {

	private readonly _activeScenes:Map<TScenesId, SceneObject<TScenesId, TSceneProps, TMainRootLayersId, string, string>> = new Map();
	private readonly _cachedScenes:Map<TScenesId, SceneObject<TScenesId, TSceneProps, TMainRootLayersId, string, string>> = new Map();
	private readonly _scenesFactory:IScenesFactory<TScenesId, TSceneProps, TMainRootLayersId, string>;
	private readonly _resizeManager:IResizeManager;
	private readonly _rooSceneImpl:ISceneImpl<TMainRootLayersId, TScenesId>;

	protected constructor(
		factory:IScenesFactory<TScenesId, TSceneProps, TMainRootLayersId, string>,
		rootSceneImpl:ISceneImpl<TMainRootLayersId, TScenesId>,
		resizeManager:IResizeManager,
	) {
		this._scenesFactory = factory;
		this._resizeManager = resizeManager;
		this._rooSceneImpl = rootSceneImpl;
	}

	isActive(sceneId:TScenesId):boolean {

		return this._activeScenes.has(sceneId);
	}

	isCached(sceneId:TScenesId):boolean {

		return this._cachedScenes.has(sceneId);
	}

	private _cache(scene:SceneObject<TScenesId, TSceneProps, TMainRootLayersId, string, string>):void {

		if(this._cachedScenes.has(scene.sceneId)) {
			return;
		}

		this._cachedScenes.set(scene.sceneId, scene);
	}

	private _getFromCache(sceneId:TScenesId):SceneObject<TScenesId, TSceneProps, TMainRootLayersId, string, string> | null {

		const scene = this._cachedScenes.get(sceneId);
		if(scene) {
			this._cachedScenes.delete(sceneId);

			return scene;
		}

		return null;
	}

	async show<TCustomSceneId extends TScenesId, TSceneLayersId extends SceneLayersIdBase>(
		sceneId:TCustomSceneId,
		sceneLayers:TSceneLayersId[]
	):Promise<ISceneHost<TSceneLayersId, string>> {

		let scene = this._activeScenes.get(sceneId);
		if(scene) {
			return scene;
		}

		scene = await this._getOrCreate(sceneId, sceneLayers);

		this._addToRoot(scene);

		if(scene.onResize) {
			this._resizeManager.addListener(scene);
		}

		this._activeScenes.set(scene.sceneId, scene);

		scene.enableInput();

		return scene;
	}

	hide<TSceneLayersId extends SceneLayersIdBase>(
		sceneHost:ISceneHost<TSceneLayersId, string>
	):boolean {

		const scene = this._activeScenes.get(sceneHost.sceneId as TScenesId);
		if(scene) {
			this._activeScenes.delete(scene.sceneId);

			scene.disableInput();

			this._resizeManager.removeListener(scene);

			this._removeFromRoot(scene);

			if(scene.sceneProps.boot_preload || scene.cacheable) {
				this._cache(scene);
			}
			else {
				scene.destroy();
			}

			return true;
		}

		return false;
	}

	private async _getOrCreate<TSceneLayersId extends SceneLayersIdBase>(
		sceneId:TScenesId,
		sceneLayers:TSceneLayersId[]
	):Promise<SceneObject<TScenesId, TSceneProps, TMainRootLayersId, TSceneLayersId, string>> {

		let scene = this._getFromCache(sceneId);
		if(scene) {
			return scene;
		}

		scene = this._scenesFactory.createScene(sceneId, sceneLayers);

		if(!scene.sceneProps.boot_preload) {
			const preloadSuccess = await scene.preload();
			if(!preloadSuccess) {
				throw new ScenePreLoadingError(sceneId, `Cannot load resources for scene '${sceneId}'!`);
			}
		}

		await scene.create();

		return Promise.resolve(scene);
	}

	private _addToRoot(scene:IScenesManagerControlled<TScenesId, TSceneProps, TMainRootLayersId>):boolean {

		return this._rooSceneImpl.addToLayer(scene.sceneId, scene.targetLayerId);
	}

	private _removeFromRoot(scene:IScenesManagerControlled<TScenesId, TSceneProps, TMainRootLayersId>):void {

		if(this._rooSceneImpl.removeFromLayer(scene.sceneId, scene.targetLayerId)) {
			return;
		}

		//this._errorThrower.throwFatalErrorEvent(new Error(
		logger.warn(
			`[SceneManager] root layer '${scene.targetLayerId}' not found when removing scene '${scene.sceneId}'!`
		);
		//);

		this._rooSceneImpl.removeFromParent(scene.sceneId);
	}

}