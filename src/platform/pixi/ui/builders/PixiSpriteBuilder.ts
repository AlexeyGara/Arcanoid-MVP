/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: PixiSpriteBuilder.ts
 * Path: src/platform/pixi/ui/builders/
 * Author: alexeygara
 * Last modified: 2026-02-24 02:04
 */

import type { PixiTexture } from "@pixi/index";
import { PixiSprite }       from "@pixi/index";
import type {
	AssetDataProvider,
	AssetTexture
}                           from "@platform/engine/assets";
import { UidService }       from "@platform/engine/assets/UidService";
import type {
	GraphicResObjAliasResolver,
	SpriteGraphicResObj
}                           from "@platform/engine/resources";
import { SpriteResName } from "@platform/engine/resources";
import {
	createPixiTexture,
	generateAssetOwnerUid
}                        from "@pixi/ui/builders/builders";
import { PixiNodeImage } from "@platform/pixi/ui/PixiNodeImage";

export class PixiSpriteBuilder {

	constructor() {
	}

	build(childResObj:SpriteGraphicResObj,
		  assetsManager:AssetDataProvider,
		  assetAliasResolver:GraphicResObjAliasResolver,
		  parentId:string
	):PixiNodeImage {
		const resType = SpriteResName;
		const assetType = "image";
		const assetAlias = assetAliasResolver(childResObj);
		const assetOwnerUid = generateAssetOwnerUid(parentId, childResObj, resType, assetType);
		const assetOwner = UidService.tryGetUniqueAssetOwner(assetOwnerUid, true);
		return this._createImageNode(
			assetsManager.getAsset(assetAlias[0], assetType, assetOwner, true),
			() => {
				assetsManager.releaseAsset(assetAlias[0], assetOwner);
			},
			childResObj.id
		);
	}

	private _createImageNode(
		assetData:AssetTexture,
		releaseAsset:() => void,
		id?:string
	):PixiNodeImage {
		const texture:PixiTexture = createPixiTexture(assetData, id);

		const originSize:Size<number> = { width: texture.width, height: texture.height };

		return new PixiNodeImage(new PixiSprite(texture),
								 releaseAsset,
								 { getWidth: () => originSize.width, getHeight: () => originSize.height },
								 id);
	}

}