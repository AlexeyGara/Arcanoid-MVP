/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: index.ts
 * Path: src/platform/engine/assets/
 * Author: alexeygara
 * Last modified: 2026-02-17 23:18
 */

import type {
	AudioMimeType,
	BinaryMimeType,
	FontMimeType,
	ImageMimeType,
	JsonTextMimeType,
	TextMimeType,
	VideoMimeType
}                    from "@web/index";
import { EMimeType } from "@web/index";

export type AssetType = "image" |
						"video" |
						"animation" |
						"text" |
						"audio" |
						"font" |
						"bitmap-font" |
						"json-object" |
						"binary";

//type AssetSourcePath = `${string}@${string}x${string}.${string}`;
type AssetSourcePath = string;

export type AssetSrcObj<TMimeType extends EMimeType = EMimeType>
	= { [T in `${TMimeType}`]?:AssetSourcePath };

export type AssetDataBase = DeepReadonly<{
	name:string;
	alias:string;
	src:AssetSrcObj;
	shared:boolean;
}>;
export type AssetTexture = AssetDataBase & DeepReadonly<{
	src:AssetSrcObj<ImageMimeType>;
	sprite_sheet?:AssetSrcObj;
	texture_name?:string;
}>;
export type AssetAnimation = AssetDataBase & DeepReadonly<{
	src:AssetSrcObj<ImageMimeType>;
	sprite_sheet:AssetSrcObj;
	texture_prefix:string;
}>;
export type AssetVideo = AssetDataBase & DeepReadonly<{
	src:AssetSrcObj<VideoMimeType>;
}>;
export type AssetAudio = AssetDataBase & DeepReadonly<{
	src:AssetSrcObj<AudioMimeType>;
}>;
export type AssetText = AssetDataBase & DeepReadonly<{
	src:AssetSrcObj<TextMimeType>;
}>;
export type AssetFont = AssetDataBase & DeepReadonly<{
	src:AssetSrcObj<FontMimeType>;
	font_face:string;
	//font_color:`#${string}`
	font_color:string;
}>;
export type AssetBitmapFont = AssetDataBase & DeepReadonly<{
	src:AssetSrcObj<ImageMimeType>;
	font_glyphs:AssetSrcObj;
	font_face:string;
}>;
export type AssetJSON = AssetDataBase & DeepReadonly<{
	src:AssetSrcObj<JsonTextMimeType>;
}>;
export type AssetBinary = AssetDataBase & DeepReadonly<{
	src:AssetSrcObj<BinaryMimeType>;
}>;

export type AssetData<TAssetType extends AssetType = AssetType> =
	TAssetType extends "image" ? AssetTexture :
	TAssetType extends "video" ? AssetVideo :
	TAssetType extends "animation" ? AssetAnimation :
	TAssetType extends "text" ? AssetText :
	TAssetType extends "audio" ? AssetAudio :
	TAssetType extends "font" ? AssetFont :
	TAssetType extends "bitmap-font" ? AssetBitmapFont :
	TAssetType extends "json-object" ? AssetJSON :
	TAssetType extends "binary" ? AssetBinary :
	never;

export type AssetUniqueAlias = symbol;

export type AssetInvokerUid = symbol;

/**
 * Asset description for assets loader use only.
 * It is a lightweight asset object that performs the linking the asset alias and the actual loaded data in the assets-loader's cache.
 * */
export type LoadableAsset<TShared extends boolean = false> = {
	/** Asset's unique ID.
	 * - Unique within the entire application. */
	readonly alias:AssetUniqueAlias;
	/** Link to load asset data. */
	readonly source:string;
	/** Asset type, see {@link AssetType} values. */
	readonly type:AssetType;
	/** Shared-flag of asset.
	 * - If it set to 'true', the asset will not be unloaded. */
	readonly shared:TShared;
};

export interface IAssetsLoader<TShared extends boolean = false> {

	isLoaded(assetUid:AssetUniqueAlias):boolean;

	load(asset:LoadableAsset<TShared>):Promise<boolean>;

	unload(assetUid:AssetUniqueAlias):Promise<void>;
}

export interface IAssetsBundle<TShared extends boolean = false> {
	readonly assetsOwnerUid:AssetInvokerUid;
	readonly shared:TShared;
	readonly assetsLinks:LoadableAsset<TShared extends true ? true : boolean>[];
	readonly loaded:boolean;

	/**
	 * Load all assets of current bundle.
	 * @param {function} onProgressCallback Callback for progress update event.
	 * @param {number} onProgressCallback.progress - Current progress value; 0 - min, 1 - max.
	 */
	load(onProgressCallback?:(progress:number) => void):Promise<boolean>;

	unload():Promise<void>;
}

export type AssetDataRegister = {

	registerAsset(assetData:AssetData):void;
}

export type AssetDataProvider = {

	getAsset<TAssetType extends AssetType, T extends boolean>(
		assetUid:AssetUniqueAlias,
		assetType:TAssetType,
		assetInvokerUid:AssetInvokerUid,
		throwErrorIfNotFound?:T
	):T extends true ? AssetData<TAssetType> : AssetData<TAssetType> | null;

	releaseAsset(assetUid:AssetUniqueAlias, assetOwner:AssetInvokerUid):void;
}

export interface IAssetsManager<TSceneId extends SceneIdBase>
	extends AssetDataRegister,
			AssetDataProvider {

	getAssetsBundles<TShared extends boolean>(
		sceneId:TSceneId
	):IAssetsBundle<TShared>[];
}

export interface IAssetsBundleFactory<TSceneId extends SceneIdBase> {

	createAssetsBundles(
		sceneId:TSceneId,
		loader:IAssetsLoader,
		srcTypeResolver:AssetSourcePathResolver,
		assetDataRegister:AssetDataRegister
	):IAssetsBundle<boolean>[];
}

export type AssetSourceTypeResolver = (assetData:AssetData) => { source:string; type:AssetType };

export type AssetSourceLocaleResolver = (assetData:AssetData) => { source:string };

export type AssetSourceDisplayRatioResolver = (assetData:AssetData) => { source:string };

export type AssetSourcePathResolver = AssetSourceTypeResolver &
									  AssetSourceLocaleResolver &
									  AssetSourceDisplayRatioResolver;

export type ImageTypeResolver = (sourceObj:AssetSrcObj<ImageMimeType>) => `${ImageMimeType}`;
export type VideoTypeResolver = (sourceObj:AssetSrcObj<VideoMimeType>) => `${VideoMimeType}`;
export type AudioTypeResolver = (sourceObj:AssetSrcObj<AudioMimeType>) => `${AudioMimeType}`;
export type TextTypeResolver = (sourceObj:AssetSrcObj<TextMimeType>) => `${TextMimeType}`;
export type FontTypeResolver = (sourceObj:AssetSrcObj<FontMimeType>) => `${FontMimeType}`;

export type ScenesAsset = {
	[P in string]:ScenesAsset | string
};

export type TextureURI = {
	[P in ImageMimeType]:string;
}

export type TexturePath = {
	textureId:string;
	textureAtlasId?:string;
	textureURI?:TextureURI;
	textureBaseURI?:string;
}

export const isTextureAssetGuard = (assetObj:AssetData):assetObj is AssetTexture => {
	if(assetObj.hasOwnProperty("sprite_sheet") &&
	   assetObj.hasOwnProperty("texture_name")) {
		return true;
	}
	return Object.keys(assetObj.src).some(k => k.startsWith("image/"));
};
export const isAnimationAssetGuard = (assetObj:AssetData):assetObj is AssetAnimation => {
	return assetObj.hasOwnProperty("sprite_sheet") &&
		   assetObj.hasOwnProperty("texture_prefix");
};
export const isVideoAssetGuard = (assetObj:AssetData):assetObj is AssetVideo => {
	return Object.keys(assetObj.src).some(k => k.startsWith("video/"));
};
export const isTextAssetGuard = (assetObj:AssetData):assetObj is AssetText => {
	return Object.keys(assetObj.src).some(k => k.startsWith("text/"));
};
export const isAudioAssetGuard = (assetObj:AssetData):assetObj is AssetAudio => {
	return Object.keys(assetObj.src).some(k => k.startsWith("audio/"));
};
export const isFontAssetGuard = (assetObj:AssetData):assetObj is AssetFont => {
	return Object.keys(assetObj.src).some(k => k.startsWith("font/"));
};
export const isBitmapFontAssetGuard = (assetObj:AssetData):assetObj is AssetBitmapFont => {
	return assetObj.hasOwnProperty("font_glyphs") &&
		   Object.keys(assetObj.src).some(k => k.startsWith("image/"));
};
export const isJsonAssetGuard = (assetObj:AssetData):assetObj is AssetJSON => {
	return assetObj.hasOwnProperty(EMimeType.APPLICATION_JSON);
};
export const isBinaryAssetGuard = (assetObj:AssetData):assetObj is AssetBinary => {
	return assetObj.hasOwnProperty(EMimeType.APPLICATION_BINARY) ||
		   assetObj.hasOwnProperty(EMimeType.APPLICATION_OGG);
};
