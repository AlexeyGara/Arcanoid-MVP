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
} from "app/scene/scenes";
import type {
	AppSTATEid,
	AppStateIsCritical,
	AppStateIsOverlay,
	AppStateOverlayMode
} from "app/state/states";

export type CustomStateId = typeof AppSTATEid.MAIN_MENU;
export type CustomIsCritical = typeof AppStateIsCritical[CustomStateId];
export type CustomIsOverlay = typeof AppStateIsOverlay[CustomStateId];
export type CustomOverlayMode = typeof AppStateOverlayMode[CustomStateId];
export type CustomSceneId = typeof AppSceneID.MENU;
export type CustomSceneLayerId = typeof AppSceneLayers[CustomSceneId][number];
export type CustomSceneViewId = SceneChildIdBase;
export type CustomSceneProps = AppSceneProps<CustomSceneId>;
export type CustomSceneTargetRootLayer = CustomSceneProps["targetRootLayer"];