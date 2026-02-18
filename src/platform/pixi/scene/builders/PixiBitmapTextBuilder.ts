/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Chesstles-TS
 * File: PixiBitmapTextBuilder.ts
 * Author: alexeygara
 * Last modified: 2026-01-18 17:50
 */

import { generateAssetOwnerUid } from "@pixi/scene/builders/builders";
import type {
	AssetBitmapFont,
	AssetDataProvider
}                                from "@platform/engine/assets";
import { UidService }                   from "@platform/engine/assets/UidService";
import type {
	BitmapTextGraphicResObj,
	GraphicResObjAliasResolver
}                                       from "@platform/engine/resources";
import { TextResName }                  from "@platform/engine/resources";
import { PixiNodeText }                 from "@platform/pixi/ui/PixiNodeText";
import { BitmapText as PixiBitmapText } from "pixi.js";

export class PixiBitmapTextBuilder {

	constructor() {
	}

	build(childResObj:BitmapTextGraphicResObj,
		  assetsManager:AssetDataProvider,
		  assetAliasResolver:GraphicResObjAliasResolver,
		  parentId:string
	):PixiNodeText {
		const resType = TextResName;
		const assetType = "bitmap-font";
		const assetAlias = assetAliasResolver(childResObj);
		const assetOwnerUid = generateAssetOwnerUid(parentId, childResObj, resType, assetType);
		const assetOwner = UidService.tryGetUniqueAssetOwner(assetOwnerUid, true);
		return this._createBitmapTextNode(
			assetsManager.getAsset(assetAlias[0], assetType, assetOwner, true),
			() => {
				assetsManager.releaseAsset(assetAlias[0], assetOwner);
			},
			childResObj.text || "",
			childResObj.id
		);
	}

	private _createBitmapTextNode(
		assetData:AssetBitmapFont,
		releaseAsset:() => void,
		text:string,
		id?:string
	):PixiNodeText {
		return new PixiNodeText(new PixiBitmapText({
													   text,
													   style: {
														   fontFamily: assetData.font_face,
													   }
												   }),
								releaseAsset,
								id);
	}
}