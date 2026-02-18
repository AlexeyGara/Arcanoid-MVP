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
	'APP.HIDE_SETTINGS':void;

	//start load
	'APP.GOTO_GAME':{ levelId:string };

	//loading
	'APP.SCENE_LOADING_PROGRESS':{ sceneId:string; progress:number };

	//loading complete
	'APP.GAME_LOADED':{ levelId:string };

	//finish on (show popup)
	'APP.GAME_FAIL':void;
	'APP.GAME_SUCCESS':void;

	//pause the game (show popup)
	'APP.GAME_PAUSE':void;
	'APP.GAME_RESUME':void;

	'APP.MUSIC.ENDED':{ musicAlias:AudioAssetID; completed:boolean };
	'APP.MUSIC.STOPPED':void;

	'APP.TRANSITION_BLOCKED':{ event:keyof AppEvent; from?:AppSTATEid; to?:AppSTATEid };
	'APP.FATAL_ERROR':Error;
}

export type AppEventId = keyof AppEvent;

export const appFsmEventsMap:EventsMap<AppEvent> = {
	// events registered at app-FSM - the events invoke gameTransitions between states
	'APP.RETURN_MAIN_MENU': true,
	'APP.GOTO_GAME':        true,
	'APP.GAME_LOADED':      true,
	'APP.GAME_SUCCESS':     true,
	'APP.GAME_FAIL':        true,
	'APP.SHOW_SETTINGS':    true,
	'APP.HIDE_SETTINGS':    true,
	'APP.GAME_PAUSE':       true,
	'APP.GAME_RESUME':      true,

	// events do not register at app-FSM, just for handle at app-FlowController or other modules
	'APP.MUSIC.ENDED':            false,
	'APP.MUSIC.STOPPED':          false,
	'APP.SCENE_LOADING_PROGRESS': false,
	'APP.TRANSITION_BLOCKED':     false,
	'APP.FATAL_ERROR':            false
} as const;