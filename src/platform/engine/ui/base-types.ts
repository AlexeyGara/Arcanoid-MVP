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

export type AlignPos = {
	readonly x?:number | AlignMode['x'];
	readonly y?:number | AlignMode['y'];
};

export type RootLayerConfig<TLayerId extends SceneLayersIdBase> = {
	readonly [P in TLayerId]:{
		readonly pos:AlignPos;
		readonly pivot?:AlignPos;
	};
};

export type RootLayersStructure<TRootLayersId extends SceneLayersIdBase> = RootLayerConfig<TRootLayersId>;
