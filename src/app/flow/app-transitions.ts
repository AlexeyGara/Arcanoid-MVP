/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Chesstles-TS
 * File: app-gameTransitions.ts
 * Author: alexeygara
 * Last modified: 2026-01-04 09:06
 */

import type { AppContext }            from "@app-api/app-types";
import type { LinkedTransitionsList } from "@core-api/fsm-types";
import type { AppEvent }              from "app/event/events";
import { AppSTATEid }                 from "app/state/states";

export const appTransitions:LinkedTransitionsList<AppSTATEid, AppEvent, AppContext> = {

	main_menu: [{
		onEvent:     'APP.GOTO_GAME',
		fromStateId: AppSTATEid.MAIN_MENU,
		toStateId:   AppSTATEid.LOADING_GAME,
	}, {
		onEvent:     'APP.SHOW_SETTINGS',
		fromStateId: AppSTATEid.MAIN_MENU,
		toStateId:   AppSTATEid.SETTINGS,
	}],

	settings: [{
		onEvent:     'APP.HIDE_SETTINGS',
		fromStateId: AppSTATEid.SETTINGS,
		toStateId:   undefined,
	}],

	loading_game: [{
		onEvent:     'APP.GAME_LOADED',
		fromStateId: AppSTATEid.LOADING_GAME,
		toStateId:   AppSTATEid.GAME_MODE,
	}],

	game: [{
		onEvent:     'APP.GAME_PAUSE',
		fromStateId: AppSTATEid.GAME_MODE,
		toStateId:   AppSTATEid.PAUSE_MODE,
	}, {
		onEvent:     'APP.GAME_FAIL',
		fromStateId: AppSTATEid.GAME_MODE,
		toStateId:   AppSTATEid.LOSE_MODE,
	}, {
		onEvent:     'APP.GAME_SUCCESS',
		fromStateId: AppSTATEid.GAME_MODE,
		toStateId:   AppSTATEid.WIN_SCREEN,
	}],

	pause_game: [{
		onEvent:     'APP.GAME_RESUME',
		fromStateId: AppSTATEid.PAUSE_MODE,
		toStateId:   undefined,
	}, {
		onEvent:     'APP.SHOW_SETTINGS',
		fromStateId: AppSTATEid.PAUSE_MODE,
		toStateId:   AppSTATEid.SETTINGS,
	}, {
		onEvent:     'APP.RETURN_MAIN_MENU',
		fromStateId: AppSTATEid.PAUSE_MODE,
		toStateId:   AppSTATEid.MAIN_MENU,
	}],

	lose_game: [{
		onEvent:     'APP.RETURN_MAIN_MENU',
		fromStateId: AppSTATEid.LOSE_MODE,
		toStateId:   AppSTATEid.MAIN_MENU,
	}, {
		onEvent:     'APP.GOTO_GAME',
		fromStateId: AppSTATEid.LOSE_MODE,
		toStateId:   AppSTATEid.LOADING_GAME,
	}],

	win_screen: [{
		onEvent:     'APP.RETURN_MAIN_MENU',
		fromStateId: AppSTATEid.WIN_SCREEN,
		toStateId:   AppSTATEid.MAIN_MENU,
	}, {
		onEvent:     'APP.GOTO_GAME',
		fromStateId: AppSTATEid.WIN_SCREEN,
		toStateId:   AppSTATEid.LOADING_GAME,
	}]
};
