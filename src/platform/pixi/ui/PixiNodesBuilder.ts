/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: PixiNodesBuilder.ts
 * Path: src/platform/pixi/ui/
 * Author: alexeygara
 * Last modified: 2026-02-24 02:04
 */

import { PixiContainer } from "@pixi/index";
import type {
	INodesUIBuilder,
	RootLayersStructure
}                        from "@platform/engine/ui";
import type {
	IDisposableNode,
	IHaveChildrenNodeUI,
	IInteractiveNodeUI,
	IResizableNodeUI
}                        from "@platform/engine/ui/nodes";
import {
	PixiNode,
	setContainerId
}                        from "@pixi/ui/PixiNode";

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