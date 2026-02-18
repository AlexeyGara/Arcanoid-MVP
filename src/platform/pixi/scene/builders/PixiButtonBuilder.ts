/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Chesstles-TS
 * File: PixiButtonBuilder.ts
 * Author: alexeygara
 * Last modified: 2026-01-18 17:58
 */

import { FancyButton as PixiButton }   from "@pixi/ui/lib/FancyButton";
import type {
	AssetDataProvider,
	AssetTexture
}                                      from "@platform/engine/assets";
import { UidService }                  from "@platform/engine/assets/UidService";
import type {
	ButtonGraphicResObj,
	GraphicResObjAliasResolver
}                                      from "@platform/engine/resources";
import { ButtonResName }  from "@platform/engine/resources";
import {
	createPixiTexture,
	generateAssetOwnerUid
}                         from "@platform/pixi/scene/builders/builders";
import { PixiNodeButton } from "@platform/pixi/ui/PixiNodeButton";
import type { Texture as PixiTexture } from "pixi.js/lib/rendering/renderers/shared/texture/Texture";

export class PixiButtonBuilder {

	constructor() {
	}

	build(childResObj:ButtonGraphicResObj,
		  assetsManager:AssetDataProvider,
		  assetAliasResolver:GraphicResObjAliasResolver,
		  parentId:string
	):PixiNodeButton {
		const resType = ButtonResName;
		const assetType = "image";
		const assetAlias = assetAliasResolver(childResObj);
		const assetOwnerUid = generateAssetOwnerUid(parentId, childResObj, resType, assetType);
		const assetOwner = UidService.tryGetUniqueAssetOwner(assetOwnerUid, true);
		const upAssetData = assetsManager.getAsset(assetAlias[0], assetType, assetOwner, true);
		return this._createButtonNode(
			{
				up: upAssetData,
				down: assetAlias.length > 1 ?
					  assetsManager.getAsset(assetAlias[1], assetType, assetOwner, true) : undefined,
				disable: assetAlias.length > 2 ?
						 assetsManager.getAsset(assetAlias[2], assetType, assetOwner, true) : undefined
			},
			() => {
				assetsManager.releaseAsset(assetAlias[0], assetOwner);
			},
			childResObj.id
		);
	}

	private _createButtonNode(
		assetsData:{ up:AssetTexture; down?:AssetTexture; disable?:AssetTexture },
		releaseAsset:() => void,
		id:string
	):PixiNodeButton {
		const upTexture:PixiTexture = createPixiTexture(assetsData.up, id);

		const button = new PixiButton({
										  defaultView: upTexture,
										  pressedView: assetsData.down ?
													   createPixiTexture(assetsData.down, id) : undefined,
										  disabledView: assetsData.disable ?
														createPixiTexture(assetsData.disable, id) : undefined
									  });
		//const container = new PixiContainer();
		//container.addChild(button);

		const originSize:Size<number> = { width: upTexture.width, height: upTexture.height };

		return new PixiNodeButton(button,
								  releaseAsset,
								  { getWidth: () => originSize.width, getHeight: () => originSize.height },
								  id);
	}
}