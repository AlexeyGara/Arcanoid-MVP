/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Chesstles-TS
 * File: PixiNodesBuilder.ts
 * Path: src/platform/pixi/scenes/
 * Author: alexeygara
 * Last modified: 2026-01-29 18:49
 */

import type {
	INodesUIBuilder,
	RootLayersStructure
}                                     from "@platform/engine/ui";
import type {
	IDisposableNode,
	IHaveChildrenNodeUI,
	IInteractiveNodeUI,
	IResizableNodeUI
}                                     from "@platform/engine/ui/nodes";
import {
	PixiNode,
	setContainerId
}                                     from "@platform/pixi/ui/PixiNode";
import { Container as PixiContainer } from "pixi.js";

const releaseAssetStub = ():void => {
};

export class PixiNodesBuilder
	implements INodesUIBuilder {

	constructor() {
	}

	createRootLayers<TRootLayerId extends SceneLayersIdBase>(
		layersStructure:RootLayersStructure<TRootLayerId>,
		root:IHaveChildrenNodeUI
	):Map<TRootLayerId, IHaveChildrenNodeUI & IDisposableNode> {
		const layers:Map<TRootLayerId, IHaveChildrenNodeUI & IDisposableNode> = new Map();
		for(const layerConfig of layersStructure) {
			const pixiLayer = new PixiContainer();
			setContainerId(pixiLayer, layerConfig.layerId);
			(root as PixiNode).pixiObject.addChild(pixiLayer);
			layers.set(layerConfig.layerId, new PixiNode(pixiLayer, releaseAssetStub, layerConfig.layerId));
			pixiLayer.x = typeof layerConfig.pos?.x == 'number' ? layerConfig.pos?.x || 0 : 0;
			pixiLayer.y = typeof layerConfig.pos?.y == 'number' ? layerConfig.pos?.y || 0 : 0;
		}
		return layers;
	}

	createContainerNode(id?:string):IHaveChildrenNodeUI & IInteractiveNodeUI & IDisposableNode & IResizableNodeUI {
		return new PixiNode(new PixiContainer(), releaseAssetStub, id);
	}

}