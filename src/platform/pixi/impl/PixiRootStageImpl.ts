/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: PixiRootSceneImpl.ts
 * Path: src/platform/pixi/scene/
 * Author: alexeygara
 * Last modified: 2026-02-24 01:54
 */

import type { IViewsHolderImpl } from "@core-api/scene-impl-types";
import { PixiContainer }      from "@pixi/index";
import type { PixiSceneImpl } from "@pixi/impl/PixiSceneImpl";
import { setContainerId }     from "@pixi/utils";
import type {
	AppRootLayersId,
	AppSceneID
}                                from "app/scene/scenes";
import { AppRootLayersOrdered }  from "app/scene/scenes";
import { SceneAttachPhaseError } from "core/errors/flow/SceneAttachPhaseError";

const ROOT_STAGE_ID = "ROOT-PIXI-SCENE";

export class PixiRootStageImpl

	implements IViewsHolderImpl<AppRootLayersId, AppSceneID> {

	private readonly _root:PixiContainer;
	private readonly _rootLayers:Map<AppRootLayersId, PixiContainer> = new Map();
	private readonly _sceneImplProvider:<TSceneId extends AppSceneID>(viewId:TSceneId) => PixiSceneImpl<TSceneId, SceneLayersIdBase, SceneChildIdBase>;

	constructor(
		root:PixiContainer,
		sceneImplProvider:<TSceneId extends AppSceneID>(viewId:TSceneId) => PixiSceneImpl<TSceneId, SceneLayersIdBase, SceneChildIdBase>
	) {
		this._root              = root;
		this._sceneImplProvider = sceneImplProvider;

		this._buildLayers(AppRootLayersOrdered);
	}

	private _buildLayers(orderedRootLayers:Readonly<AppRootLayersId[]>):void {

		for(const layerId of orderedRootLayers) {
			const layer = new PixiContainer();
			setContainerId(layer, layerId);
			this._root.addChild(layer);

			this._rootLayers.set(layerId, layer);
		}
	}

	addToLayer(sceneId:AppSceneID, targetLayerId:AppRootLayersId):boolean {
		if(!this._rootLayers.size) {
			logger.warn(`[PixiRootStageImpl::addToLayer:] There is no any scene layers when attaching scene!`);
			return false;
		}

		const rootLayer = this._rootLayers.get(targetLayerId);
		if(!rootLayer) {
			throw new SceneAttachPhaseError(ROOT_STAGE_ID, sceneId,
											`Layer '${targetLayerId}' not found when attach '${sceneId}' scene!`);
		}

		const sceneImpl = this._sceneImplProvider(sceneId);
		if(!sceneImpl) {
			throw new SceneAttachPhaseError(ROOT_STAGE_ID, sceneId,
											`Scene implementation of '${sceneId}' not found for attach!`);
		}

		rootLayer.addChild(sceneImpl.stage);

		return true;
	}

	removeFromLayer(sceneId:AppSceneID, targetLayerId:AppRootLayersId):boolean {
		if(!this._rootLayers.size) {
			logger.warn(`[PixiRootStageImpl::removeFromLayer:] There is no any scene layers when removing scene!`);
			return false;
		}

		const rootLayer = this._rootLayers.get(targetLayerId);
		if(!rootLayer) {
			throw new SceneAttachPhaseError(ROOT_STAGE_ID, sceneId,
											`Layer '${targetLayerId}' not found when detach '${sceneId}' scene!`);
		}

		const sceneImpl = this._sceneImplProvider(sceneId);
		if(!sceneImpl) {
			throw new SceneAttachPhaseError(ROOT_STAGE_ID, sceneId,
											`Scene implementation of '${sceneId}' not found for detach!`);
		}

		rootLayer.removeChild(sceneImpl.stage);

		return true;
	}

	removeFromParent(sceneId:AppSceneID):void {

		const sceneImpl = this._sceneImplProvider(sceneId);
		if(!sceneImpl) {
			throw new SceneAttachPhaseError(ROOT_STAGE_ID, sceneId,
											`Scene implementation of '${sceneId}' not found for remove from parent!`);
		}

		sceneImpl.stage.removeFromParent();
	}

}