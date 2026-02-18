/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Chesstles-TS
 * File: PixiMovieBuilder.ts
 * Author: alexeygara
 * Last modified: 2026-01-18 17:36
 */

import type {
	AssetAnimation,
	AssetDataProvider
}                                              from "@platform/engine/assets";
import { UidService }                          from "@platform/engine/assets/UidService";
import { ResourceBuildError }                  from "@platform/engine/errors/ResourceBuildError";
import type {
	GraphicResObjAliasResolver,
	MovieGraphicResObj
}                                              from "@platform/engine/resources";
import { MovieResName }          from "@platform/engine/resources";
import { generateAssetOwnerUid } from "@platform/pixi/scene/builders/builders";
import { PixiNodeAnimation }     from "@platform/pixi/ui/PixiNodeAnimation";
import {
	AnimatedSprite as PixiAnimatedSprite,
	Assets
}                                              from "pixi.js";
import type { Texture as PixiTexture }         from "pixi.js/lib/rendering/renderers/shared/texture/Texture";
import type { Spritesheet as PixiSpriteSheet } from "pixi.js/lib/spritesheet/Spritesheet";

export class PixiMovieBuilder {

	constructor() {
	}

	build(childResObj:MovieGraphicResObj,
		  assetsManager:AssetDataProvider,
		  assetAliasResolver:GraphicResObjAliasResolver,
		  parentId:string
	):PixiNodeAnimation {
		const resType = MovieResName;
		const assetType = "animation";
		const assetAlias = assetAliasResolver(childResObj);
		const assetOwnerUid = generateAssetOwnerUid(parentId, childResObj, resType, assetType);
		const assetOwner = UidService.tryGetUniqueAssetOwner(assetOwnerUid, true);
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
		const sheet:PixiSpriteSheet = Assets.get(assetData.alias);
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