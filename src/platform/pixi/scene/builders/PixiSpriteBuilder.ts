/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Chesstles-TS
 * File: PixiSpriteBuilder.ts
 * Author: alexeygara
 * Last modified: 2026-01-18 17:12
 */

import type {
	AssetDataProvider,
	AssetTexture
}                                      from "@platform/engine/assets";
import { UidService }                  from "@platform/engine/assets/UidService";
import type {
	GraphicResObjAliasResolver,
	SpriteGraphicResObj
}                                      from "@platform/engine/resources";
import { SpriteResName } from "@platform/engine/resources";
import {
	createPixiTexture,
	generateAssetOwnerUid
}                        from "@platform/pixi/scene/builders/builders";
import { PixiNodeImage } from "@platform/pixi/ui/PixiNodeImage";
import { Sprite as PixiSprite }        from "pixi.js";
import type { Texture as PixiTexture } from "pixi.js/lib/rendering/renderers/shared/texture/Texture";

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