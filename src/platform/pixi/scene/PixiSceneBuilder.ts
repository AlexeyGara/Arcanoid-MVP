/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: PixiSceneBuilder.ts
 * Path: src/platform/pixi/scenes/
 * Author: alexeygara
 * Last modified: 2026-01-29 19:22
 */

import type { AssetDataProvider } from "@platform/engine/assets";
import { ResourceBuildError }     from "@platform/engine/errors/ResourceBuildError";
import type {
	AnyResObj,
	BitmapTextGraphicResObj,
	ButtonGraphicResObj,
	GraphicResObjAliasResolver,
	MovieGraphicResObj,
	ResObj,
	ResourceDescription,
	SpriteGraphicResObj,
	TextGraphicResObj
}                                 from "@platform/engine/resources";
import {
	ContainerResName,
	isBitmapTextGraphicResObjGuard,
	isButtonResObjGuard,
	isContainerResObjGuard,
	isMovieGraphicResObjGuard,
	isSpriteGraphicResObjGuard,
	isTextGraphicResObjGuard
}                                 from "@platform/engine/resources";
import type {
	INodesUIBuilder,
	ISceneUIBuilder,
	RootLayersStructure
}                                 from "@platform/engine/ui";
import type {
	IDisposableNode,
	IHaveChildrenNodeUI,
	IInteractiveNodeUI,
	INodeUI,
	IResizableNodeUI
}                                 from "@platform/engine/ui/nodes";
import { reformNewParentId }      from "@platform/pixi/scene/builders/builders";
import { PixiBitmapTextBuilder }  from "@platform/pixi/scene/builders/PixiBitmapTextBuilder";
import { PixiButtonBuilder }      from "@platform/pixi/scene/builders/PixiButtonBuilder";
import { PixiMovieBuilder }       from "@platform/pixi/scene/builders/PixiMovieBuilder";
import { PixiSpriteBuilder }      from "@platform/pixi/scene/builders/PixiSpriteBuilder";
import { PixiTextBuilder }        from "@platform/pixi/scene/builders/PixiTextBuilder";
import type { PixiNodesBuilder }  from "@platform/pixi/scene/PixiNodesBuilder";
import type { PixiNodeAnimation } from "@platform/pixi/ui/PixiNodeAnimation";
import type { PixiNodeButton }    from "@platform/pixi/ui/PixiNodeButton";
import type { PixiNodeImage }     from "@platform/pixi/ui/PixiNodeImage";
import type { PixiNodeText }      from "@platform/pixi/ui/PixiNodeText";

export class PixiSceneBuilder implements ISceneUIBuilder,
										 INodesUIBuilder {

	private readonly _assetAliasResolver:GraphicResObjAliasResolver;
	private readonly _assetsProvider:AssetDataProvider;
	private readonly _spriteBuilder:{
		build(childResObj:SpriteGraphicResObj, assetsManager:AssetDataProvider,
			  assetAliasResolver:GraphicResObjAliasResolver, parentId:string):PixiNodeImage;
	};
	private readonly _movieBuilder:{
		build(childResObj:MovieGraphicResObj, assetsManager:AssetDataProvider,
			  assetAliasResolver:GraphicResObjAliasResolver, parentId:string):PixiNodeAnimation;
	};
	private readonly _bitmapTextBuilder:{
		build(childResObj:BitmapTextGraphicResObj, assetsManager:AssetDataProvider,
			  assetAliasResolver:GraphicResObjAliasResolver, parentId:string):PixiNodeText;
	};
	private readonly _textBuilder:{
		build(childResObj:TextGraphicResObj, assetsManager:AssetDataProvider,
			  assetAliasResolver:GraphicResObjAliasResolver, parentId:string):PixiNodeText;
	};
	private readonly _buttonBuilder:{
		build(childResObj:ButtonGraphicResObj, assetsManager:AssetDataProvider,
			  assetAliasResolver:GraphicResObjAliasResolver, parentId:string):PixiNodeButton;
	};
	private _nodesBuilder:PixiNodesBuilder;

	constructor(
		assetAliasResolver:GraphicResObjAliasResolver,
		assetsManager:AssetDataProvider,
		nodesBuilder:PixiNodesBuilder
	) {
		this._assetAliasResolver = assetAliasResolver;
		this._assetsProvider = assetsManager;
		this._nodesBuilder = nodesBuilder;
		this._spriteBuilder = new PixiSpriteBuilder();
		this._movieBuilder = new PixiMovieBuilder();
		this._bitmapTextBuilder = new PixiBitmapTextBuilder();
		this._textBuilder = new PixiTextBuilder();
		this._buttonBuilder = new PixiButtonBuilder();
	}

	createRootLayers<TRootLayerId extends SceneLayersIdBase>(
		layersStructure:RootLayersStructure<TRootLayerId>,
		root:IHaveChildrenNodeUI
	):Map<TRootLayerId, IHaveChildrenNodeUI & IDisposableNode> {
		return this._nodesBuilder.createRootLayers(layersStructure, root);
	}

	createContainerNode(id?:string):IHaveChildrenNodeUI & IInteractiveNodeUI & IDisposableNode & IResizableNodeUI {
		return this._nodesBuilder.createContainerNode(id);
	}

	build(viewId:string,
		  resourceDescription:ResourceDescription,
		  rootNode?:IHaveChildrenNodeUI & IDisposableNode
	):IHaveChildrenNodeUI & IDisposableNode {
		rootNode ||= this.createContainerNode();

		const viewResObj = resourceDescription.views[viewId];
		if(!viewResObj) {
			throw new ResourceBuildError(viewId, ContainerResName,
										 `Cannot build resources for view '${viewId}' - view structure not found!`);
		}

		for(const viewChildName of viewResObj['[]']) {
			const viewChildResObj = viewResObj['{}'][viewChildName];
			if(!viewChildResObj) {
				throw new ResourceBuildError(viewId, ContainerResName,
											 `Cannot find child named "${viewChildName}" at view '${viewId}'!`);
			}
			this._buildChild(viewId, viewChildResObj, rootNode);
		}

		return rootNode;
	}

	private _buildChild(parentId:string,
						resObj:AnyResObj,
						root:IHaveChildrenNodeUI
	):void {
		let node:INodeUI;
		if(isSpriteGraphicResObjGuard(resObj)) {
			node = this._spriteBuilder.build(resObj, this._assetsProvider, this._assetAliasResolver, parentId);
		}
		else if(isMovieGraphicResObjGuard(resObj)) {
			node = this._movieBuilder.build(resObj, this._assetsProvider, this._assetAliasResolver, parentId);
		}
		else if(isBitmapTextGraphicResObjGuard(resObj)) {
			node = this._bitmapTextBuilder.build(resObj, this._assetsProvider, this._assetAliasResolver, parentId);
		}
		else if(isTextGraphicResObjGuard(resObj)) {
			node = this._textBuilder.build(resObj, this._assetsProvider, this._assetAliasResolver, parentId);
		}
		else if(isButtonResObjGuard(resObj)) {
			node = this._buttonBuilder.build(resObj, this._assetsProvider, this._assetAliasResolver, parentId);
		}
		else if(isContainerResObjGuard(resObj)) {
			const container = this.createContainerNode(resObj.id);
			node = container;
			for(const childName of resObj['[]']) {
				const childResObj = resObj["{}"][childName];
				if(!childResObj) {
					throw new ResourceBuildError(resObj.id, ContainerResName,
												 `Cannot find child named "${childName}" at '${parentId}::${resObj.id}'!`);
				}
				this._buildChild(reformNewParentId(parentId, childResObj), childResObj, container);
			}
		}
		else {
			assertNever(resObj);
		}

		this._setPos(node, resObj);
		this._setPivot(node, resObj);

		root.addChild(node);
	}

	private _setPos(node:INodeUI, resObj:ResObj):void {
		node.x = resObj.pos?.x || 0;
		node.y = resObj.pos?.y || 0;
	}

	private _setPivot(node:INodeUI, resObj:ResObj):void {
		node.pivotX = resObj.pivot?.x || 0;
		node.pivotY = resObj.pivot?.y || 0;
	}

}