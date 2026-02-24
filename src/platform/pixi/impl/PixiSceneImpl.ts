/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: PixiSceneImpl.ts
 * Path: src/platform/pixi/scene/
 * Author: alexeygara
 * Last modified: 2026-02-18 17:53
 */

import type { ISceneImpl }          from "@core-api/scene-impl-types";
import type { ResizeInfo }          from "@core-api/service-types";
import { PixiContainer }     from "@pixi/index";
import type { PixiViewImpl } from "@pixi/impl/PixiViewImpl";
import {
	alignPosition,
	setContainerId
}                            from "@pixi/utils";
import type { IAssetsBundle }       from "@platform/engine/assets";
import { InteractMode }             from "@platform/engine/interraction";
import type { RootLayersStructure } from "@platform/engine/ui/base-types";
import { SceneAttachPhaseError }    from "core/errors/flow/SceneAttachPhaseError";

export abstract class PixiSceneImpl<TSceneId extends SceneIdBase,
	TSceneLayersId extends SceneLayersIdBase,
	TSceneChildId extends SceneChildIdBase>

	implements ISceneImpl<TSceneId, TSceneLayersId, TSceneChildId> {

	@final
	readonly sceneId:TSceneId;

	get interactive():boolean {
		return this._root?.interactive || false;
	}

	get stage():PixiContainer {
		return this._root;
	}

	private readonly _sceneLayersStructure:RootLayersStructure<TSceneLayersId>;
	private readonly _sceneLayersOrder:Readonly<TSceneLayersId[]>;
	private readonly _sceneLayers:Map<TSceneLayersId, PixiContainer> = new Map();
	private readonly _assetsBundles:IAssetsBundle[];
	private readonly _viewImplProvider:(viewId:TSceneChildId) => PixiViewImpl<TSceneChildId>;
	private readonly _root:PixiContainer;

	protected constructor(
		id:TSceneId,
		sceneLayers:Readonly<TSceneLayersId[]>,
		sceneLayersStructure:RootLayersStructure<TSceneLayersId>,
		assetsBundles:IAssetsBundle[],
		viewImplProvider:(viewId:TSceneChildId) => PixiViewImpl<TSceneChildId>,
	) {
		this.sceneId               = id;
		this._sceneLayersOrder     = sceneLayers;
		this._sceneLayersStructure = sceneLayersStructure;
		this._assetsBundles        = assetsBundles;
		this._viewImplProvider     = viewImplProvider;

		this._root = new PixiContainer();
		setContainerId(this._root, id);
	}

	addToLayer(childId:TSceneChildId, targetLayerId:TSceneLayersId):boolean {
		if(!this._sceneLayers.size) {
			logger.warn(`[PixiSceneImpl::addToLayer:] There is no any scene layers when attaching view!`);
			return false;
		}

		const rootLayer = this._sceneLayers.get(targetLayerId);
		if(!rootLayer) {
			throw new SceneAttachPhaseError(this.sceneId, childId,
											`Layer '${targetLayerId}' not found when attach '${childId}' child!`);
		}

		const viewImpl = this._viewImplProvider(childId);
		if(!viewImpl) {
			throw new SceneAttachPhaseError(this.sceneId, childId,
											`View implementation of '${childId}' not found for attach!`);
		}

		rootLayer.addChild(viewImpl.stage);
		return true;
	}

	removeFromLayer(childId:TSceneChildId, targetLayerId:TSceneLayersId):boolean {
		if(!this._sceneLayers.size) {
			logger.warn(`[PixiSceneImpl::removeFromLayer:] There is no any scene layers when removing view!`);
			return false;
		}

		const rootLayer = this._sceneLayers.get(targetLayerId);
		if(!rootLayer) {
			throw new SceneAttachPhaseError(this.sceneId, childId,
											`Layer '${targetLayerId}' not found when detach '${childId}' child!`);
		}

		const viewImpl = this._viewImplProvider(childId);
		if(!viewImpl) {
			throw new SceneAttachPhaseError(this.sceneId, childId,
											`View implementation of '${childId}' not found for detach!`);
		}

		rootLayer.removeChild(viewImpl.stage);
		return true;
	}

	removeFromParent(childId:TSceneChildId):void {

		const viewImpl = this._viewImplProvider(childId);
		if(!viewImpl) {
			throw new SceneAttachPhaseError(this.sceneId, childId,
											`View implementation of '${childId}' not found when try to remove from parent!`);
		}

		viewImpl.stage.removeFromParent();
	}

	enableInteraction():void {

		this._root.interactive = true;
		this._root.eventMode   = InteractMode.STATIC;
	}

	disableInteraction():void {

		this._root.interactive = false;
		this._root.eventMode   = InteractMode.NONE;
	}

	/** preload all required own resources, etc. before creating scene */
	async doPreload(progressCallback?:(progress:number) => void):Promise<boolean> {

		const waiters:Promise<boolean>[] = [];

		for(const assetsBundle of this._assetsBundles) {
			if(!assetsBundle.loaded) {
				waiters.push(assetsBundle.load(progressCallback));
			}
		}

		return Promise.all(waiters).then((success:boolean[]) => {
			return success.length == 0 || success.indexOf(false) < 0;
		});
	}

	doCreate():Promise<void> {

		for(const layerId of this._sceneLayersOrder) {
			const layer = new PixiContainer();
			setContainerId(layer, layerId);
			this._root.addChild(layer);

			this._sceneLayers.set(layerId, layer);
		}

		return Promise.resolve();
	}

	async doDestroy():Promise<void> {

		for(const layer of this._sceneLayers.values()) {
			this._root.removeChild(layer);
			layer.destroy();
		}
		this._sceneLayers.clear();

		const waiters:Promise<void>[] = [];

		for(const assetsBundle of this._assetsBundles) {
			waiters.push(assetsBundle.unload());
		}

		return Promise.all(waiters).then();
	}

	onResize(resize:ResizeInfo):void {
		// resize scene's root layers
		const zeroPos = { x: 0, y: 0 };

		for(const layerId of this._sceneLayersOrder) {
			const layer = this._sceneLayers.get(layerId);

			if(!layer) {
				return;
			}

			const layerData = this._sceneLayersStructure[layerId];
			const layerPos  = layerData.pos || zeroPos;

			alignPosition(layer, layerPos, resize.viewPort, layerData.pivot);
		}
	}
}