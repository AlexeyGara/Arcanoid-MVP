/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: states.ts
 * Path: src/app/state/
 * Author: alexeygara
 * Last modified: 2026-02-18 17:37
 */

import type { AppContext }  from "@app-api/app-types";
import type {
	ICanStateChange,
	ICanStatesRegister,
	IState,
	Transition
}                           from "@core-api/fsm-types";
import type { AppEvent }    from "app/event/events";
import { StateOverlayMode } from "core/fsm/state/StateOverlayMode";

export const AppSTATEid = {
	MAIN_MENU:    'main_menu',
	SETTINGS:     'settings',
	LOADING_GAME: 'loading_game',
	GAME_MODE:    'game',
	PAUSE_MODE:   "pause_game",
	LOSE_MODE:    'lose_game',
	WIN_SCREEN:   'win_screen',
} as const;

export type AppSTATEid = typeof AppSTATEid[keyof typeof AppSTATEid];

/** The allowed overlay mode when combined with another state that will overlap the current one. */
export const AppStateOverlayMode = {
	[AppSTATEid.MAIN_MENU]:    StateOverlayMode.INACTIVE,
	[AppSTATEid.SETTINGS]:     StateOverlayMode.PAUSE,
	[AppSTATEid.LOADING_GAME]: StateOverlayMode.FORBIDDEN,
	[AppSTATEid.GAME_MODE]:    StateOverlayMode.PAUSE,
	[AppSTATEid.PAUSE_MODE]:   StateOverlayMode.FORBIDDEN,
	[AppSTATEid.LOSE_MODE]:    StateOverlayMode.PAUSE,
	[AppSTATEid.WIN_SCREEN]:   StateOverlayMode.INACTIVE
} as const;

/** The flag for 'overlay mode' what this state should be started. */
export const AppStateIsOverlay = {
	[AppSTATEid.MAIN_MENU]:    false,
	[AppSTATEid.LOADING_GAME]: false,
	[AppSTATEid.GAME_MODE]:    false,
	[AppSTATEid.WIN_SCREEN]:   false,
	[AppSTATEid.LOSE_MODE]:    true,
	[AppSTATEid.SETTINGS]:     true,
	[AppSTATEid.PAUSE_MODE]:   true
} as const;

/** The critical state: the only this state's own transitions are available to go.
 * Not any 'none-critical' overlay-state can initiate any transition. */
export const AppStateIsCritical = {
	[AppSTATEid.MAIN_MENU]:    false,
	[AppSTATEid.LOADING_GAME]: true,
	[AppSTATEid.GAME_MODE]:    true,
	[AppSTATEid.WIN_SCREEN]:   true,
	[AppSTATEid.LOSE_MODE]:    true,
	[AppSTATEid.SETTINGS]:     false,
	[AppSTATEid.PAUSE_MODE]:   true
} as const;

export type AppState = IState<AppSTATEid, AppEvent>;
export type AppTransition = Transition<AppSTATEid, AppEvent, AppContext>;
export type AppStateCreator<K extends AppSTATEid> = () => IState<K, AppEvent>;
export type AppStateMachine = ICanStatesRegister<AppSTATEid, AppEvent, AppContext>
							  & ICanStateChange<AppSTATEid, AppEvent>;