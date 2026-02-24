/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: PixiMovieBuilder.ts
 * Path: src/platform/pixi/ui/builders/
 * Author: alexeygara
 * Last modified: 2026-02-24 02:04
 */

import type {
	PixiSpriteSheet,
	PixiTexture
}                                from "@pixi/index";
import {
	PixiAnimatedSprite,
	PixiAssets
}                                from "@pixi/index";
import type {
	AssetAnimation,
	AssetDataProvider
}                                from "@platform/engine/assets";
import { UidService }            from "@platform/engine/assets/UidService";
import { ResourceBuildError }    from "@platform/engine/errors/ResourceBuildError";
import type {
	GraphicResObjAliasResolver,
	MovieGraphicResObj
}                                from "@platform/engine/resources";
import { MovieResName }          from "@platform/engine/resources";
import { generateAssetOwnerUid } from "@pixi/ui/builders/builders";
import { PixiNodeAnimation }     from "@platform/pixi/ui/PixiNodeAnimation";

export class PixiMovieBuilder {

	constructor() {
	}

	build(childResObj:MovieGraphicResObj,
		  assetsManager:AssetDataProvider,
		  assetAliasResolver:GraphicResObjAliasResolver,
		  parentId:string
	):PixiNodeAnimation {
		const resType       = MovieResName;
		const assetType     = "animation";
		const assetAlias    = assetAliasResolver(childResObj);
		const assetOwnerUid = generateAssetOwnerUid(parentId, childResObj, resType, assetType);
		const assetOwner    = UidService.tryGetUniqueAssetOwner(assetOwnerUid, true);
		return this._createAnimationNode(
			assetsManager.getAsset(assetAlias[0], assetType, assetOwner, true),
			() => {
				assetsManager.releaseAsset(assetAlias[0], assetOwner);
			},
			childResObj.id
		);
	}

	private _createAnimationNode(
		assetData:AssetAnimation,
		releaseAsset:() => void,
		id?:string
	):PixiNodeAnimation {
		const sheet:PixiSpriteSheet  = PixiAssets.get(assetData.alias);
		const textures:PixiTexture[] = sheet?.animations[assetData.texture_prefix];

		if(!textures || textures.length == 0) {
			throw new ResourceBuildError(`${id}`, MovieResName, `Textures of '${assetData.alias}' not found!`);
		}

		const originSize:Size<number> = { width: textures[0].width, height: textures[0].height };

		return new PixiNodeAnimation(new PixiAnimatedSprite(textures),
									 releaseAsset,
									 { getWidth: () => originSize.width, getHeight: () => originSize.height },
									 id);
	}
}