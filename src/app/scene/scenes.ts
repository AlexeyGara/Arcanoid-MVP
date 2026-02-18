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

export type AppRootLayers = typeof AppRootLayers[keyof typeof AppRootLayers];

export type AppRootLayersId = AppRootLayers[0];

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
		targetRootLayer:typeof AppRootLayers.APP_LOADER_LEVEL[0];
		sceneLayers:typeof AppSceneLayers[typeof AppSceneID.LOADING];
	};
	[AppSceneID.GAME]:{
		boot_preload:false;
		cacheable:false;
		targetRootLayer:typeof AppRootLayers.APP_MAIN_LEVEL[0];
		sceneLayers:typeof AppSceneLayers[typeof AppSceneID.GAME];
	};
	[AppSceneID.WIN]:{
		boot_preload:true;
		cacheable:true;
		targetRootLayer:typeof AppRootLayers.APP_MAIN_LEVEL[0];
		sceneLayers:typeof AppSceneLayers[typeof AppSceneID.WIN];
	};
	[AppSceneID.SETTINGS]:{
		boot_preload:false;
		cacheable:true;
		targetRootLayer:typeof AppRootLayers.APP_POPUP_LEVEL[0];
		sceneLayers:typeof AppSceneLayers[typeof AppSceneID.SETTINGS];
	};
	[AppSceneID.PAUSE]:{
		boot_preload:true;
		cacheable:true;
		targetRootLayer:typeof AppRootLayers.APP_POPUP_LEVEL[0];
		sceneLayers:typeof AppSceneLayers[typeof AppSceneID.PAUSE];
	};
	[AppSceneID.LOSE]:{
		boot_preload:true;
		cacheable:true;
		targetRootLayer:typeof AppRootLayers.APP_POPUP_LEVEL[0];
		sceneLayers:typeof AppSceneLayers[typeof AppSceneID.LOSE];
	};
}>;

type AppScenePropNames<CustomAppSceneId extends AppSceneID> = Exclude<keyof AppScene[CustomAppSceneId], 'sceneLayers'>;

export type AppSceneProps<CustomAppSceneId extends AppSceneID> = { [P in AppScenePropNames<CustomAppSceneId>]:AppScene[CustomAppSceneId][P] };

export type AppSceneLayers<CustomAppSceneId extends AppSceneID> = AppScene[CustomAppSceneId]['sceneLayers'];

export type AppSceneLayersIds<CustomAppSceneId extends AppSceneID> = AppSceneLayers<CustomAppSceneId>[number];

export type TAppScenePropsData = AppSceneProps<AppSceneID>;

// ---- TYPES TEST ---> [
/*
type MenusScenePropNames = AppScenePropNames<typeof AppSceneID.MENU>;
type MenuSceneProps = AppSceneProps<typeof AppSceneID.MENU>;
type MenuSceneLayers = AppSceneLayers<typeof AppSceneID.MENU>;
type MenuSceneLayersId = AppSceneLayersIds<typeof AppSceneID.MENU>;

export const menusScenePropNames:MenusScenePropNames = "cacheable";
export const menuLayerId:MenuSceneLayersId           = "title";
export const menuSceneProps:MenuSceneProps           = {
	boot_preload:    true,
	cacheable:       true,
	targetRootLayer: "app-common-layer"
};
export const menuSceneLayers:MenuSceneLayers         = ["background", "title", "ui", "service"];
*/
// ] <--- TYPES TEST ----
