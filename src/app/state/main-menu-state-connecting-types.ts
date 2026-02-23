/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: main-menu-state-connecting-types.ts
 * Path: src/app/state/
 * Author: alexeygara
 * Last modified: 2026-02-22 00:03
 */

import type {
	AppSceneID,
	AppSceneLayers,
	AppSceneProps
}                             from "app/scene/scenes";
import type { AppSceneViews } from "app/scene/views";
import type {
	AppSTATEid,
	AppStateIsCritical,
	AppStateIsOverlay,
	AppStateOverlayMode
}                             from "app/state/states";

export type MainMenu_StateId = typeof AppSTATEid.MAIN_MENU;
export type MainMenu_IsCritical = typeof AppStateIsCritical[MainMenu_StateId];
export type MainMenu_IsOverlay = typeof AppStateIsOverlay[MainMenu_StateId];
export type MainMenu_OverlayMode = typeof AppStateOverlayMode[MainMenu_StateId];

export type MainMenu_SceneId = typeof AppSceneID.MENU;
export type MainMenu_SceneLayerId = typeof AppSceneLayers[MainMenu_SceneId][number];
export type MainMenu_SceneViewId = SceneChildIdBase;
export type MainMenu_SceneProps = AppSceneProps<MainMenu_SceneId>;
export type MainMenu_SceneTargetRootLayer = MainMenu_SceneProps["targetRootLayer"];

export type Background_View = typeof AppSceneViews[MainMenu_SceneId]['background_view'];