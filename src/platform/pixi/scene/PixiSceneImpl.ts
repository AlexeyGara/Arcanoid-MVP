/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: PixiSceneImpl.ts
 * Path: src/platform/pixi/scene/
 * Author: alexeygara
 * Last modified: 2026-02-18 17:53
 */

import type { ISceneImpl }        from "@core-api/scene-impl-types";
import type { ResizeInfo }        from "@core-api/service-types";
import type { INodeUIPosAligner } from "@platform/engine/ui";
import type {
	IDisposableNode,
	IHaveChildrenNodeUI,
	IInteractiveNodeUI,
	INodeUI
}                                 from "@platform/engine/ui/nodes";

export abstract class PixiSceneImpl<TSceneId extends SceneIdBase, TSceneLayersId extends SceneLayersIdBase, TSceneChildId extends SceneChildIdBase>
	implements ISceneImpl<TSceneId, TSceneLayersId, TSceneChildId> {

	readonly abstract sceneId:TSceneId;

	readonly root:IHaveChildrenNodeUI & IInteractiveNodeUI;

	get stage():INodeUI {
		return this.root;
	}

	private readonly _sceneLayersStructure:RootLayersStructure<TSceneLayersId>;
	private readonly _sceneLayers:Map<TSceneLayersId, IHaveChildrenNodeUI & IDisposableNode>;
	private readonly _sceneLayersAligner:INodeUIPosAligner;

	protected constructor(
		assetsBundles:IAssetsBundle[],
		nodeBuilder:INodesUIBuilder,
		errorThrower:GlobalErrorEventsEmitter,
		sceneLayers:RootLayersStructure<TSceneLayersId>,
		sceneLayersAligner:INodeUIPosAligner,
		root?:IHaveChildrenNodeUI & IInteractiveNodeUI
	) {
		this.root = root || nodeBuilder.createContainerNode(this.sceneId);
		this._sceneLayersStructure = sceneLayers;
		this._sceneLayers = nodeBuilder.createRootLayers(this.getRootLayersStructure(sceneLayers), this.root);
		this._sceneLayersAligner = sceneLayersAligner;
		this._assetsBundles = assetsBundles;
	}

	abstract getRootLayersStructure(layers:Readonly<TSceneLayersId[]>):RootLayersStructure<TSceneLayersId>;

	addToLayer(childId:TSceneChildId, targetLayerId:TSceneLayersId):boolean {

		const rootLayer = this._sceneLayers.get(targetLayerId);
		if(!rootLayer) {
			return false;
		}

		rootLayer.removeChild(view.stage);
	}

	removeFromLayer(childId:TSceneChildId, targetLayerId:TSceneLayersId):boolean {

		const rootLayer = this._sceneLayers.get(targetLayerId);
		if(!rootLayer) {
			return false;
		}

		rootLayer.removeChild(view.stage);
	}

	removeFromParent(childId:TSceneChildId):void {
		view.stage.removeFromParent();
	}

	readonly interactive:boolean;

	enableInteraction():void {

	}

	disableInteraction():void {

	}

	/** preload all required own resources, etc. before creating scene */
	async doPreload(progressCallback?:(progress:number) => void):Promise<boolean> {
		const waiters:Promise<boolean>[] = [];
		for(const assetsBundle of this._assetsBundles) {
			if(!assetsBundle.loaded) {
				waiters.push(assetsBundle.load(this.onPreloadProgress?.bind(this)));
			}
		}
		return Promise.all(waiters).then((success:boolean[]) => {
			return success.length == 0 || success.indexOf(false) < 0;
		});
	}

	doCreate():Promise<void> {

	}

	async doDestroy():Promise<void> {
		for(const layer of this._sceneLayers.values()) {
			this.root.removeChild(layer);
			layer.dispose();
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
		const zeroPos:Point<number> = { x: 0, y: 0 };
		for(const layerStructure of this._sceneLayersStructure) {
			const layerNode = this._sceneLayers.get(layerStructure.layerId);
			if(!layerNode) {
				continue;
			}
			const layerPos = layerStructure.pos || zeroPos;
			if(!layerPos) {
				continue;
			}
			this._sceneLayersAligner.alignPosition(layerNode, layerPos, resize.viewPort);
		}
	}
}