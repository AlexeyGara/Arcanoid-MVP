/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: scenes-layers.ts
 * Path: src/platform/pixi/scene/app/
 * Author: alexeygara
 * Last modified: 2026-02-23 20:59
 */

import type { RootLayerConfig }  from "@platform/engine/ui/base-types";
import type { AppSceneLayersId } from "app/scene/scenes";
import { AppSceneID }            from "app/scene/scenes";

export type AppSceneLayersStructure = {
	readonly [TSceneID in AppSceneID]:RootLayerConfig<AppSceneLayersId<TSceneID>>;
};

export const AppSceneLayersStructure:AppSceneLayersStructure = {
	[AppSceneID.MENU]:     {
		background: { pos: { x: "left", y: "top" }, pivot: { x: 0, y: 0 } },
		title:      { pos: { x: "center", y: "top" } },
		ui:         { pos: { x: "center", y: "center" } },
		service:    { pos: { x: "center", y: "bottom" } }
	},
	[AppSceneID.LOADING]:  {
		background: { pos: { x: "left", y: "top" } },
		content:    { pos: { x: "center", y: "center" } },
		message:    { pos: { x: "center", y: "bottom" } }
	},
	[AppSceneID.GAME]:     {
		background: { pos: { x: "left", y: "top" } },
		gamefield:  { pos: { x: "center", y: "center" } },
		hud:        { pos: { x: "center", y: "top" } },
	},
	[AppSceneID.WIN]:      {
		background: { pos: { x: "left", y: "top" } },
		score:      { pos: { x: 0, y: 0 } },
		info:       { pos: { x: 0, y: 0 } },
		ui:         { pos: { x: 0, y: 0 } },
	},
	[AppSceneID.SETTINGS]: {
		background: { pos: { x: "center", y: "center" } },
		ui:         { pos: { x: 0, y: 0 } },
	},
	[AppSceneID.PAUSE]:    {
		background: { pos: { x: "center", y: "center" } },
		content:    { pos: { x: 0, y: 0 } },
		ui:         { pos: { x: 0, y: 0 } },
	},
	[AppSceneID.LOSE]:     {
		background: { pos: { x: "center", y: "center" } },
		content:    { pos: { x: 0, y: 0 } },
		ui:         { pos: { x: 0, y: 0 } },
	},

} as const;
