/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: events.ts
 * Path: src/app/event/
 * Author: alexeygara
 * Last modified: 2026-02-18 17:25
 */

import type { AudioAssetID } from "@core-api/audio-types";
import type { AppSTATEid }   from "app/state/states";

export type AppEvent = {
	//enter/return to
	'APP.RETURN_MAIN_MENU':void;

	//settings
	'APP.SHOW_SETTINGS':void;

	//start load
	'APP.GOTO_GAME':{ levelId:string };

	//loading
	'APP.SCENE_LOADING_PROGRESS':{ sceneId:string; progress:number };

	//loading complete
	'APP.GAME_LOADED':{ levelId:string };

	//finish on (show popup)
	'APP.GAME_SUCCESS':void;

	'APP.MUSIC.ENDED':{ musicAlias:AudioAssetID; completed:boolean };
	'APP.MUSIC.STOPPED':void;

	'APP.TRANSITION_BLOCKED':{ event:keyof AppEvent; from?:AppSTATEid; to?:AppSTATEid };
	'APP.FATAL_ERROR':Error;
}

export type AppEventId = keyof AppEvent;