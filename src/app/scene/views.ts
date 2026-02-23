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
} from "app/scene/scenes";

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

} as const;