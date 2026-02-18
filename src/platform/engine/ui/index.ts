/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: index.ts
 * Path: src/platform/engine/ui/
 * Author: alexeygara
 * Last modified: 2026-02-17 23:30
 */

import type { ResourceDescription } from "@platform/engine/resources";
import type {
	AlignMode,
	RootLayerConfig
}                                   from "@platform/engine/ui/base-types";
import type {
	IDisposableNode,
	IHaveChildrenNodeUI,
	IInteractiveNodeUI,
	INodeUI,
	IResizableNodeUI
}                                   from "@platform/engine/ui/nodes";

export interface IResourcesFactory<TSceneId extends SceneIdBase> {

	createResourcesDesc(sceneId:TSceneId):ResourceDescription;
}

export interface IHaveOwnRootNode {
	/** A layered root container on what scenes (a 'stage' of each scene) will be added. */
	readonly root:IHaveChildrenNodeUI;
}

export interface IHaveStageNodeToAdd<TTargetLayerId extends SceneLayersIdBase> {
	/** A 'stage' what should add on one of the layers of root container. */
	readonly stage:INodeUI;

	/** An identifier of layer of root where 'stage' of this scene/view will be added. */
	readonly targetLayerId:TTargetLayerId;
}

export interface ICanAddStageToOwnRoot<TTargetLayerId extends SceneLayersIdBase>
	extends IHaveOwnRootNode {

	/**
	 * Add stage of the scene (view) to one of the layers of root container.
	 * @param view Scene/view that has a stage node for add to layer of the root container.
	 */
	add(view:IHaveStageNodeToAdd<TTargetLayerId>):void;

	/**
	 * Remove stage of the scene (view) from root container (from respective layer of root container).
	 * @param view Scene/view that has a stage node that need to remove from the root container.
	 */
	remove(view:IHaveStageNodeToAdd<TTargetLayerId>):void;
}

export type RootLayersStructure<TRootLayersId extends SceneLayersIdBase> = Readonly<RootLayerConfig<TRootLayersId>[]>;

export interface INodesUIBuilder {
	/**
	 * Create root layers according to layers structure and add them to root container.
	 * @param layersStructure All layers structure.
	 * @param root A root container for created layers.
	 * @return A map of all created layers with layers IDs pairs.
	 */
	createRootLayers<TRootLayerId extends SceneLayersIdBase>(
		layersStructure:RootLayersStructure<TRootLayerId>,
		root:IHaveChildrenNodeUI
	):Map<TRootLayerId, IHaveChildrenNodeUI & IDisposableNode>;

	/**
	 * Create a platform dependent UI-node that will be a container for other UI-nodes.
	 * @param id The identifier for creating UI-container.
	 * @return A container UI-node.
	 */
	createContainerNode(id?:string):IHaveChildrenNodeUI & IInteractiveNodeUI & IDisposableNode & IResizableNodeUI;
}

export interface ISceneUIBuilder {
	/**
	 * Build full ui-structure of scene accordingly resources structure.
	 * @param viewId An identifier for specified view from views list at resource description.
	 * @param resourceDescription A description of resources structure.
	 * @param rootNode A target root container for build children tree as scene structure.
	 * @return A root container of other UI-nodes inside, accordingly resources structure.
	 */
	build(
		viewId:string,
		resourceDescription:ResourceDescription,
		rootNode?:IHaveChildrenNodeUI
	):IHaveChildrenNodeUI & IDisposableNode;
}

export interface INodeUIPosAligner {

	alignPosition(node:INodeUI, targetPos:Point<number> | AlignMode, sizeArea:ViewPort):void;

}
