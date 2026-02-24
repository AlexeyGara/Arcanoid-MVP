/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: views.ts
 * Path: src/app/scene/
 * Author: alexeygara
 * Last modified: 2026-02-21 00:09
 */
import {
	AppSceneID,
	AppSceneLayers
}                                from "app/scene/scenes";

export const AppSceneViews = {
	[AppSceneID.MENU]: {
		background_view: {
			id:            "main-menu_background",
			targetLayerId: AppSceneLayers[AppSceneID.MENU][0]
		},
		title_view:      {
			id:            "main-menu_title",
			targetLayerId: AppSceneLayers[AppSceneID.MENU][1]
		},
		ui_view:         {
			id:            "main-menu_ui",
			targetLayerId: AppSceneLayers[AppSceneID.MENU][2]
		},
		service_view:    {
			id:            "main-menu_service",
			targetLayerId: AppSceneLayers[AppSceneID.MENU][3]
		}
	},
	[AppSceneID.LOADING]: {
		background_view: {
			id:            "loading_background",
			targetLayerId: AppSceneLayers[AppSceneID.LOADING][0]
		},
	},
	[AppSceneID.GAME]: {
		background_view: {
			id:            "game_background",
			targetLayerId: AppSceneLayers[AppSceneID.GAME][0]
		},
	},
	[AppSceneID.WIN]: {
		background_view: {
			id:            "win_background",
			targetLayerId: AppSceneLayers[AppSceneID.WIN][0]
		},
	},
	[AppSceneID.SETTINGS]: {
		background_view: {
			id:            "settings_background",
			targetLayerId: AppSceneLayers[AppSceneID.SETTINGS][0]
		},
	},
	[AppSceneID.PAUSE]: {
		background_view: {
			id:            "pause_background",
			targetLayerId: AppSceneLayers[AppSceneID.PAUSE][0]
		},
	},
	[AppSceneID.LOSE]: {
		background_view: {
			id:            "lose_background",
			targetLayerId: AppSceneLayers[AppSceneID.LOSE][0]
		},
	},

} as const;

export type AppSceneViewName<TSceneId extends AppSceneID> = keyof typeof AppSceneViews[TSceneId]
