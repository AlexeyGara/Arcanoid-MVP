/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: base-types.ts
 * Path: src/platform/engine/ui/
 * Author: alexeygara
 * Last modified: 2026-02-19 11:48
 */

export type AlignMode = {
	x:"center" | 'left' | 'right';
	y:'center' | 'top' | 'bottom';
};

export type RootLayerConfig<TLayersId extends SceneLayersIdBase> = {
	readonly layerId:TLayersId;
	readonly pos?:Point<number> | AlignMode;
	readonly pivot?:Point<number> | AlignMode;
};

export type RootLayersStructure<TRootLayersId extends SceneLayersIdBase> = Readonly<RootLayerConfig<TRootLayersId>[]>;