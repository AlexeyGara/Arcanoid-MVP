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
		fromStateId: AppSTATEid.MAIN_MENU, toStateId: AppSTATEid.LOADING_GAME,
		onEvent:     'APP.GOTO_GAME'
	}, {
		fromStateId: AppSTATEid.MAIN_MENU, toStateId: AppSTATEid.SETTINGS,
		onEvent:     'APP.SHOW_SETTINGS'
	}],

	settings: [{
		fromStateId: undefined, toStateId:AppSTATEid.MAIN_MENU,
		onEvent: 'APP.SHOW_SETTINGS'
	}],

	loading_game: [{
		fromStateId: AppSTATEid.LOADING_GAME, toStateId: AppSTATEid.GAME_MODE,
		onEvent:     'APP.GAME_LOADED'
	}],

	game: [{
		fromStateId: AppSTATEid.GAME_MODE, toStateId: AppSTATEid.PAUSE_MODE,
		onEvent:     'APP.GAME_PAUSE'
	}, {
		fromStateId: AppSTATEid.GAME_MODE, toStateId: AppSTATEid.WIN_SCREEN,
		onEvent:     'APP.GAME_SUCCESS'
	}],

	pause_game: [{
		fromStateId: AppSTATEid.PAUSE_MODE, toStateId: AppSTATEid.MAIN_MENU,
		onEvent:     'APP.RETURN_MAIN_MENU'
	}, {
		fromStateId: AppSTATEid.TRAINING_MODE, toStateId: AppSTATEid.LOADING_TRAINING,
		onEvent:     'APP.GOTO_TRAIN_LEVEL'
	}],

	win_screen: [{
		fromStateId: AppSTATEid.WIN_SCREEN, toStateId: AppSTATEid.MAIN_MENU,
		onEvent:     'APP.RETURN_MAIN_MENU'
	}, {
		fromStateId: AppSTATEid.WIN_SCREEN, toStateId: AppSTATEid.LOADING_MAP,
		onEvent:     'APP.GOTO_MAP'
	}, {
		fromStateId: AppSTATEid.WIN_SCREEN, toStateId: AppSTATEid.LOADING_GAME,
		onEvent:     'APP.GOTO_GAME_LEVEL'
	}]
};
