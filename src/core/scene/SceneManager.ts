/*
 * Copyright (c) Alexey Gara 2025.
 * "Chesstles-TS" project
 * Current file: "SceneManager.ts"
 * Last modified date: 28.12.2025, 10:58
 * All rights reserved.
 */

import type { IViewsHolderImpl } from "@core-api/scene-impl-types";
import type {
	ISceneHost,
	IScenesFactory,
	IScenesManager,
	IScenesManagerControlled,
	SceneObject
}                                from "@core-api/scene-types";
import type { IResizeManager }   from "@core-api/service-types";
import { ScenePreLoadingError }  from "core/errors/flow/ScenePreLoadingError";

export abstract class SceneManager<TScenesId extends SceneIdBase,
	TSceneProps extends SceneIdPropsBase<TMainRootLayersId>,
	TSceneLayersId extends SceneLayersIdBase,
	TSceneChildrenId extends SceneChildIdBase,
	TMainRootLayersId extends SceneLayersIdBase>

	implements IScenesManager<TScenesId, TSceneLayersId, TSceneChildrenId> {

	private readonly _activeScenes:Map<TScenesId, SceneObject<TScenesId, TSceneProps, TMainRootLayersId, TSceneLayersId, TSceneChildrenId>> = new Map();
	private readonly _cachedScenes:Map<TScenesId, SceneObject<TScenesId, TSceneProps, TMainRootLayersId, TSceneLayersId, TSceneChildrenId>> = new Map();
	private readonly _scenesFactory:IScenesFactory<TScenesId, TSceneProps, TMainRootLayersId, TSceneLayersId, TSceneChildrenId>;
	private readonly _resizeManager:IResizeManager;
	private readonly _rootContainerImpl:IViewsHolderImpl<TMainRootLayersId, TScenesId>;

	protected constructor(
		factory:IScenesFactory<TScenesId, TSceneProps, TMainRootLayersId, TSceneLayersId, TSceneChildrenId>,
		rootContainerImpl:IViewsHolderImpl<TMainRootLayersId, TScenesId>,
		resizeManager:IResizeManager,
	) {
		this._scenesFactory     = factory;
		this._resizeManager     = resizeManager;
		this._rootContainerImpl = rootContainerImpl;
	}

	@final
	isActive(sceneId:TScenesId):boolean {

		return this._activeScenes.has(sceneId);
	}

	@final
	isCached(sceneId:TScenesId):boolean {

		return this._cachedScenes.has(sceneId);
	}

	private _cache(scene:SceneObject<TScenesId, TSceneProps, TMainRootLayersId, TSceneLayersId, TSceneChildrenId>):void {

		if(this._cachedScenes.has(scene.sceneId)) {
			return;
		}

		this._cachedScenes.set(scene.sceneId, scene);
	}

	private _getFromCache(sceneId:TScenesId):SceneObject<TScenesId, TSceneProps, TMainRootLayersId, TSceneLayersId, TSceneChildrenId> | null {

		const scene = this._cachedScenes.get(sceneId);
		if(scene) {
			this._cachedScenes.delete(sceneId);

			return scene;
		}

		return null;
	}

	@final
	async show<TCustomSceneId extends TScenesId>(
		sceneId:TCustomSceneId
	):Promise<ISceneHost<TSceneLayersId, TSceneChildrenId>> {

		let scene = this._activeScenes.get(sceneId);
		if(scene) {
			return scene;
		}

		if(this.isCached(sceneId)) {
			scene = this._getFromCache(sceneId)!;
		}
		else {
			scene = await this._create(sceneId);
		}

		this._addToRoot(scene);

		if(scene.onResize) {
			this._resizeManager.addListener(scene);
		}

		this._activeScenes.set(scene.sceneId, scene);

		scene.enableInput();

		return scene;
	}

	@final
	hide<TSceneLayersId extends SceneLayersIdBase, TViewsId extends SceneChildIdBase>(
		sceneHost:ISceneHost<TSceneLayersId, TViewsId>
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

	private async _create(
		sceneId:TScenesId
	):Promise<SceneObject<TScenesId, TSceneProps, TMainRootLayersId, TSceneLayersId, TSceneChildrenId>> {

		const scene = this._scenesFactory.createScene(sceneId);

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

		return this._rootContainerImpl.addToLayer(scene.sceneId, scene.targetLayerId);
	}

	private _removeFromRoot(scene:IScenesManagerControlled<TScenesId, TSceneProps, TMainRootLayersId>):void {

		if(this._rootContainerImpl.removeFromLayer(scene.sceneId, scene.targetLayerId)) {
			return;
		}

		//this._errorThrower.throwFatalErrorEvent(new Error(
		logger.warn(
			`[SceneManager] root layer '${scene.targetLayerId}' not found when removing scene '${scene.sceneId}'!`
		);
		//);

		this._rootContainerImpl.removeFromParent(scene.sceneId);
	}

}