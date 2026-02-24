/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: lose-state-connecting-types.ts
 * Path: src/app/state/types/connecting_types/
 * Author: alexeygara
 * Last modified: 2026-02-24 17:07
 */

import type { ISceneImpl }    from "@core-api/scene-impl-types";
import type { IViewImpl }     from "@core-api/view-impl-types";
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

export type StateId = typeof AppSTATEid.LOSE_MODE;
export type IsCritical = typeof AppStateIsCritical[StateId];
export type IsOverlay = typeof AppStateIsOverlay[StateId];
export type OverlayMode = typeof AppStateOverlayMode[StateId];

export type SceneId = typeof AppSceneID.LOSE;
export type SceneLayerId = typeof AppSceneLayers[SceneId][number];
export type SceneProps = AppSceneProps<SceneId>;
export type SceneTargetRootLayer = SceneProps["targetRootLayer"];

export type Background_View = typeof AppSceneViews[SceneId]['background_view'];

export type SceneViewsId = Background_View['id'];

export type SceneImpl = ISceneImpl<SceneId, SceneLayerId, SceneViewsId>;

export type SceneImplProvider = (sceneId:SceneId) => SceneImpl;

export type ViewImpl<TViewImpl extends SceneViewsId> = IViewImpl<TViewImpl>;

export type ViewImplProvider<TViewImpl extends ViewImpl<SceneViewsId>>
	= (viewId:SceneViewsId) => TViewImpl;