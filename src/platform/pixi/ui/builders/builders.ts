/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Chesstles-TS
 * File: builders.ts
 * Author: alexeygara
 * Last modified: 2026-01-18 17:32
 */

import type {
	PixiSpriteSheet,
	PixiTexture
}                             from "@pixi/index";
import { PixiAssets }         from "@pixi/index";
import type {
	AssetTexture,
	AssetType
}                             from "@platform/engine/assets";
import { ResourceBuildError } from "@platform/engine/errors/ResourceBuildError";
import type {
	AnyResObj,
	SceneResourceType
}                             from "@platform/engine/resources";
import { SpriteResName }      from "@platform/engine/resources";

export const generateAssetOwnerUid = (parentId:string,
									  resObj:AnyResObj,
									  resType:SceneResourceType,
									  assetType:AssetType):string => {
	return `${reformNewParentId(parentId, resObj)}-${resType}-${assetType}`;
};

export const reformNewParentId = (parentId:string,
								  currentChild:AnyResObj):string => {
	return `${parentId}::${currentChild.id}`;
};

export const createPixiTexture = (assetData:AssetTexture, resId?:string):PixiTexture => {
	let texture:PixiTexture;
	if(assetData.texture_name) {
		const sheet:PixiSpriteSheet = PixiAssets.get(assetData.alias);
		texture = sheet?.textures[assetData.texture_name];
	}
	else {
		texture = PixiAssets.get(assetData.alias);
	}

	if(!texture) {
		throw new ResourceBuildError(`${resId}`, SpriteResName, `Texture of '${assetData.alias}' not found!`);
	}

	return texture;
};
