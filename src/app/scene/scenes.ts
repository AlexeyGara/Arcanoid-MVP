/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: scenes.ts
 * Path: src/app/scene/
 * Author: alexeygara
 * Last modified: 2026-02-20 21:57
 */

export const AppSceneID = {
	MENU:     "MENU",
	LOADING:  "LOADING",
	GAME:     "GAME",
	WIN:      "WIN",
	SETTINGS: "SETTINGS",
	PAUSE:    "PAUSE",
	LOSE:     "LOSE"
} as const;

export type AppSceneID = typeof AppSceneID[keyof typeof AppSceneID];

export const AppSceneLayers = {
	[AppSceneID.MENU]:     ["background", "title", "ui", "service"],
	[AppSceneID.LOADING]:  ["background", "content", "message"],
	[AppSceneID.GAME]:     ["background", "gamefield", "hud"],
	[AppSceneID.WIN]:      ["background", "score", "info", "ui"],
	[AppSceneID.SETTINGS]: ["background", "ui"],
	[AppSceneID.PAUSE]:    ["background", "content", "ui"],
	[AppSceneID.LOSE]:     ["background", "content", "ui"],
} as const;

export const AppRootLayers = {
	APP_SERVICE_LEVEL:    ['app-tech-service-popup-layer', 4],
	APP_POPUP_LEVEL:      ['app-popup-layer', 3],
	APP_LOADER_LEVEL:     ['app-loader-layer', 2],
	APP_MAIN_LEVEL:       ['app-common-layer', 1],
	APP_BACKGROUND_LEVEL: ['app-background-layer', 0],
} as const;

export type AppScene = DeepReadonly<{
	[AppSceneID.MENU]:{
		boot_preload:true;
		cacheable:true;
		targetRootLayer:typeof AppRootLayers.APP_MAIN_LEVEL[0];
		sceneLayers:typeof AppSceneLayers[typeof AppSceneID.MENU];
	};
	[AppSceneID.LOADING]:{
		boot_preload:true;
		cacheable:true;
		targetRootLayer:typeof AppRootLayers.APP_LOADER_LEVEL;
		sceneLayers:typeof AppSceneLayers[typeof AppSceneID.LOADING];
	};
	[AppSceneID.GAME]:{
		boot_preload:false;
		cacheable:false;
		targetRootLayer:typeof AppRootLayers.APP_MAIN_LEVEL;
		sceneLayers:typeof AppSceneLayers[typeof AppSceneID.GAME];
	};
	[AppSceneID.WIN]:{
		boot_preload:true;
		cacheable:true;
		targetRootLayer:typeof AppRootLayers.APP_MAIN_LEVEL;
		sceneLayers:typeof AppSceneLayers[typeof AppSceneID.WIN];
	};
	[AppSceneID.SETTINGS]:{
		boot_preload:false;
		cacheable:true;
		targetRootLayer:typeof AppRootLayers.APP_POPUP_LEVEL;
		sceneLayers:typeof AppSceneLayers[typeof AppSceneID.SETTINGS];
	};
	[AppSceneID.PAUSE]:{
		boot_preload:true;
		cacheable:true;
		targetRootLayer:typeof AppRootLayers.APP_POPUP_LEVEL;
		sceneLayers:typeof AppSceneLayers[typeof AppSceneID.PAUSE];
	};
	[AppSceneID.LOSE]:{
		boot_preload:true;
		cacheable:true;
		targetRootLayer:typeof AppRootLayers.APP_POPUP_LEVEL;
		sceneLayers:typeof AppSceneLayers[typeof AppSceneID.LOSE];
	};
}>;