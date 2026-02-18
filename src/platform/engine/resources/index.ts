/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: index.ts
 * Path: src/platform/engine/resources/
 * Author: alexeygara
 * Last modified: 2026-02-17 23:21
 */

import type { AssetUniqueAlias } from "@platform/engine/assets";

export const ESceneResourceType = {
	CONTAINER: "container",
	SPRITE: "sprite",
	TEXT: "text",
	BUTTON: "button",
	MOVIE: "movie"
} as const;

export const ContainerResName:ContainerResType = ESceneResourceType.CONTAINER;
export const SpriteResName:SpriteResType = ESceneResourceType.SPRITE;
export const TextResName:TextResType = ESceneResourceType.TEXT;
export const ButtonResName:ButtonResType = ESceneResourceType.BUTTON;
export const MovieResName:MovieResType = ESceneResourceType.MOVIE;

export const EAlignMode = {
	NONE: "none",
	LEFT: "left",
	RIGHT: "right",
	TOP: "top",
	BOTTOM: "bottom",
	CENTER: "center",
	PROPORTIONAL: "proportional"
} as const;

export const EScaleMode = {
	NONE: "none",
	FIT: "fit",
	PROPORTIONAL: "proportional"
} as const;

export const EEffectType = {
	TINT: "tint",
	BRIGHTNESS: "brightness",
	CONTRAST: "contrast",
	SATURATION: "saturation",
	HUE: "hue"
} as const;

export const EResourceType = {
	IMAGE: 256,

	VIDEO: 512,

	SOUND: 1024,
	SOUND_FX: 1025,
	SOUND_MUSIC: 1026,

	BINARY: 2048,

	TEXT: 4096,
	TEXT_JSON: 4097,
	TEXT_XML: 4098,

	ATLAS: 4352,
	ATLAS_JSON: 4353,
	ATLAS_XML: 4354,

	FONT: 8192,

	JS_MODULE: 16384,
} as const;

export type ESceneResourceType = typeof ESceneResourceType[keyof typeof ESceneResourceType];

export type ContainerResType = "container";
export type SpriteResType = "sprite";
export type TextResType = "text";
export type ButtonResType = "button";
export type MovieResType = "movie";

export type SceneResourceType = ContainerResType | SpriteResType | TextResType | ButtonResType | MovieResType;

export type EAlignMode = typeof EAlignMode[keyof typeof EAlignMode];

export type EScaleMode = typeof EScaleMode[keyof typeof EScaleMode];

export type EEffectType = typeof EEffectType[keyof typeof EEffectType];

export type HAlignMode = typeof EAlignMode.NONE |
						 typeof EAlignMode.LEFT |
						 typeof EAlignMode.RIGHT |
						 typeof EAlignMode.CENTER |
						 typeof EAlignMode.PROPORTIONAL;

export type VAlignMode = typeof EAlignMode.NONE |
						 typeof EAlignMode.TOP |
						 typeof EAlignMode.BOTTOM |
						 typeof EAlignMode.CENTER |
						 typeof EAlignMode.PROPORTIONAL;

export type TintEffect = Readonly<{

	type:typeof EEffectType.TINT;
	color:string;
	strength:number;

}>;

export type BrightnessEffect = Readonly<{

	type:typeof EEffectType.BRIGHTNESS;
	/** Brightness value in range -1...1: 0 - no effect, -1 - darken, 1 - lighten */
	value:number;

}>;

export type ContrastEffect = Readonly<{

	type:typeof EEffectType.CONTRAST;
	/** Contrast value in range -1...1: 0 - no effect, -1 - low intensity, 1 - high intensity */
	value:number;

}>;

export type SaturationEffect = Readonly<{

	type:typeof EEffectType.SATURATION;
	/** Saturation value in range -1...1: 0 - no effect, -1 - fully black-and-white, 1 - maximum saturation */
	value:number;

}>;

export type HueEffect = Readonly<{

	type:typeof EEffectType.HUE;
	/** Hue angle value in range -179...180, 0 - no effect */
	angle:degrees180;

}>;

export type SceneResource = Readonly<ContainerResource & {

	backgroundColor:string;
	origin_asset_size:AssetSizeResource;

}>

export type ContainerResource = Readonly<OmitProps<SceneResourceObject, "texture" | "animation" |
																		"text" | "format" |
																		"origin" |
																		"states"> & {
											 type:typeof ESceneResourceType.CONTAINER;
										 }>

export type ImageResource = Readonly<OmitProps<SceneResourceObject, "text" | "format" |
																	"animation" |
																	"states" |
																	"children"> & {
										 type:typeof ESceneResourceType.SPRITE;
									 }>

export type TextResource = Readonly<OmitProps<SceneResourceObject, "texture" | "animation" |
																   "states" |
																   "children"> & {
										type:typeof ESceneResourceType.TEXT;
									}>

export type ButtonResource = Readonly<OmitProps<SceneResourceObject, "button_mode" |
																	 "texture" | "animation" |
																	 "text" | "format" |
																	 "children"> & {
										  type:typeof ESceneResourceType.BUTTON;
									  }>

export type AnimationResource = Readonly<OmitProps<SceneResourceObject, "text" | "format" |
																		"states" |
																		"children"> & {
											 type:typeof ESceneResourceType.MOVIE;
										 }>

export type SceneResourceObject = Readonly<TransformResource & VisibleResource & {

	type:ESceneResourceType;

	button_mode?:boolean;
	localizations?:Readonly<Array<string>>;

	/** texture id (from file `resources.json`) */
	texture:string;

	animation:AnimationData;

	/** text id (from localized file `texts.json`) */
	text:string;
	format:TextFormat;

	states:{
		out:SceneResourceObject;
		pressed?:SceneResourceObject;
		disabled?:SceneResourceObject;
	};

	children:ChildrenResourcesList;

	effects?:EffectsResourcesList;

}>

export type EffectResource = Readonly<{

										  type:string;

									  } & (TintEffect | BrightnessEffect | ContrastEffect | SaturationEffect | HueEffect)>

export type EffectsResourcesList = Readonly<Array<EffectResource>>;

export type ChildrenResourcesList = Readonly<{
	[P in string]:SceneResourceObject
}>;

export type TransformResource = Readonly<{

	align?:AlignResource;
	scale_mode?:ScaleModeResource;
	origin?:OriginResource;
	position?:PositionResource;
	size?:SizeResource;
	/** rotation angle, in degrees */
	rotation?:number;

}>

export type AssetSizeResource = Readonly<{
	w:number;
	h:number;
}>

export type AlignResource = Readonly<{
	x:HAlignMode;
	y:VAlignMode;
}>

export type ScaleModeResource = Readonly<{
	x:EScaleMode;
	y:EScaleMode;
}>

export type SizeResource = Readonly<{
	w:number;
	h:number;
}>

export type OriginResource = Readonly<{
	x:number;
	y:number;
}>

export type PositionResource = Readonly<{
	x:number;
	y:number;
}>

export type VisibleResource = Readonly<{
	alpha?:number;
	visible?:boolean;
}>

export type TextFormat = Readonly<{
	font:string;
	align:string;
	size:number;
	color:string;
}>

export type AnimationData = Readonly<{
	/** animation speed - animation frames should be changes with current value per second */
	fps?:number;
	startFrameIndex?:uint;
	totalFrames?:uint;
	loop?:boolean;
}>;

export type EResourceType = typeof EResourceType[keyof typeof EResourceType];

export type SoundResourceType = typeof EResourceType.SOUND | typeof EResourceType.SOUND_FX
								| typeof EResourceType.SOUND_MUSIC;

export type TextResourceType = typeof EResourceType.TEXT | typeof EResourceType.TEXT_JSON
							   | typeof EResourceType.TEXT_XML;

export type TextureResourceType = typeof EResourceType.IMAGE | typeof EResourceType.VIDEO | typeof EResourceType.BINARY;

export type AtlasResourceType = typeof EResourceType.ATLAS | typeof EResourceType.ATLAS_JSON
								| typeof EResourceType.ATLAS_XML;

export type ResObjOrderedChildList = string[];

export type ResObj = DeepReadonly<{
	id:string;
	type:{ [ResType in SceneResourceType]?:boolean };
	pos?:{ x:number; y:number };
	pivot?:{ x:number; y:number };
	"[]"?:ResObjOrderedChildList;
	"{}"?:{ readonly [ResSubObjName in string]:AnyResObj };
}>;

export type ResourceDescription = DeepReadonly<{
	origin_asset_size:{ w:number; h:number };
	views:{
		[ViewName in string]:{
			"{}":{ readonly [ResObjName in string]:AnyResObj };
			"[]":ResObjOrderedChildList;
		}
	};
}>;

export type SpriteGraphicResObj = ResObj & DeepReadonly<{
	type:{ [ResType in SpriteResType]:boolean };
	texture_alias:string;
}>;
export type MovieGraphicResObj = ResObj & DeepReadonly<{
	type:{ [ResType in MovieResType]:boolean };
	texture_sequence:string;
}>;
export type BitmapTextGraphicResObj = ResObj & DeepReadonly<{
	type:{ [ResType in TextResType]:boolean };
	texture_sequence:string;
	text?:string;
}>;
export type TextGraphicResObj = ResObj & DeepReadonly<{
	type:{ [ResType in TextResType]:boolean };
	font_name:string;
	font_size:number;
	text?:string;
}>;
export type ButtonGraphicResObj = ResObj & DeepReadonly<{
	type:{ [ResType in ButtonResType]:boolean };
	id:string;
	up_texture_alias:string;
	down_texture_alias?:string;
	disable_texture_alias?:string;
}>;

export type GraphicResObj = SpriteGraphicResObj |
							MovieGraphicResObj |
							BitmapTextGraphicResObj |
							TextGraphicResObj |
							ButtonGraphicResObj;

export type ContainerResObj = ResObj & DeepReadonly<{
	type:{ [ResType in ContainerResType]:boolean };
	"[]":ResObjOrderedChildList;
	"{}":{ readonly [ResSubObjName in string]:ResObj };
}>;

export type AnyResObj = GraphicResObj | ContainerResObj;

export type GraphicResObjData<TGraphicResObj extends GraphicResObj> =
	TGraphicResObj extends SpriteGraphicResObj ? Omit<SpriteGraphicResObj, 'type'> :
	TGraphicResObj extends MovieGraphicResObj ? Omit<MovieGraphicResObj, 'type'> :
	TGraphicResObj extends BitmapTextGraphicResObj ? Omit<BitmapTextGraphicResObj, 'type'> :
	TGraphicResObj extends TextGraphicResObj ? Omit<TextGraphicResObj, 'type'> :
	TGraphicResObj extends ButtonGraphicResObj ? Omit<ButtonGraphicResObj, 'type'> :
	Omit<TGraphicResObj, 'type'>;

export type GraphicResObjAliasResolver<TGraphicResObj extends GraphicResObj = GraphicResObj>
	= (resObj:TGraphicResObj) => AssetUniqueAlias[];

export const isSpriteGraphicResObjGuard = (resObj:ResObj):resObj is SpriteGraphicResObj => {
	return resObj.type.hasOwnProperty(SpriteResName);
};
export const isMovieGraphicResObjGuard = (resObj:ResObj):resObj is MovieGraphicResObj => {
	return resObj.type.hasOwnProperty(MovieResName);
};
export const isBitmapTextGraphicResObjGuard = (resObj:ResObj):resObj is BitmapTextGraphicResObj => {
	return resObj.type.hasOwnProperty(TextResName) && resObj.hasOwnProperty('texture_sequence');
};
export const isTextGraphicResObjGuard = (resObj:ResObj):resObj is TextGraphicResObj => {
	return resObj.type.hasOwnProperty(TextResName) && resObj.hasOwnProperty('font_name');
};
export const isButtonResObjGuard = (resObj:ResObj):resObj is ButtonGraphicResObj => {
	return resObj.type.hasOwnProperty(ButtonResName) && resObj.hasOwnProperty('up_state');
};
export const isContainerResObjGuard = (resObj:ResObj):resObj is ContainerResObj => {
	return resObj.type.hasOwnProperty(ContainerResName);
};
