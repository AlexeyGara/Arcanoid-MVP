/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Chesstles-TS
 * File: PixiTextBuilder.ts
 * Author: alexeygara
 * Last modified: 2026-01-18 17:54
 */
import type {
	AssetDataProvider,
	AssetFont
}                                from "@platform/engine/assets";
import { UidService }            from "@platform/engine/assets/UidService";
import type {
	GraphicResObjAliasResolver,
	TextGraphicResObj
}                                from "@platform/engine/resources";
import { TextResName }           from "@platform/engine/resources";
import { generateAssetOwnerUid } from "@platform/pixi/scene/builders/builders";
import { PixiNodeText }          from "@platform/pixi/ui/PixiNodeText";
import { Text as PixiText }      from "pixi.js";

export class PixiTextBuilder {

	constructor() {
	}

	build(childResObj:TextGraphicResObj,
		  assetsManager:AssetDataProvider,
		  assetAliasResolver:GraphicResObjAliasResolver,
		  parentId:string
	):PixiNodeText {
		const resType = TextResName;
		const assetType = "font";
		const assetAlias = assetAliasResolver(childResObj);
		const assetOwnerUid = generateAssetOwnerUid(parentId, childResObj, resType, assetType);
		const assetOwner = UidService.tryGetUniqueAssetOwner(assetOwnerUid, true);
		return this._createTextNode(
			assetsManager.getAsset(assetAlias[0], assetType, assetOwner, true),
			() => {
				assetsManager.releaseAsset(assetAlias[0], assetOwner);
			},
			childResObj.font_size as uintMoreZero,
			childResObj.text || "",
			childResObj.id
		);
	}

	private _createTextNode(
		assetData:AssetFont,
		releaseAsset:() => void,
		fontSize:uintMoreZero,
		text:string,
		id?:string
	):PixiNodeText {
		return new PixiNodeText(new PixiText({
												 text,
												 style: {
													 fontFamily: assetData.font_face,
													 fontSize: fontSize,
													 fill: assetData.font_color
												 }
											 }),
								releaseAsset,
								id);
	}
}