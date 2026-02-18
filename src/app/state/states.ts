/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: states.ts
 * Path: src/app/state/
 * Author: alexeygara
 * Last modified: 2026-02-18 17:37
 */

import type { AppContext } from "@app-api/app-types";
import type {
	ICanStateChange,
	ICanStatesRegister,
	IState,
	Transition
}                          from "@core-api/fsm-types";
import type { AppEvent }   from "app/event/events";

export const AppSTATEid = {
	MAIN_MENU: 'main_menu',
	BONUS_ROOM: 'bonus_room',
	LOADING_MAP: 'loading_map',
	MAP_SCREEN: 'map',
	LOADING_TRAINING: 'loading_training',
	TRAINING_MODE: 'training',
	LOADING_GAME: 'loading_game',
	GAME_MODE: 'game',
	WIN_SCREEN: 'win_screen',
} as const;

export type AppSTATEid = typeof AppSTATEid[keyof typeof AppSTATEid];

export type AppState = IState<AppSTATEid, AppEvent>;
export type AppTransition = Transition<AppSTATEid, AppEvent, AppContext>;
export type AppStateCreator<K extends AppSTATEid> = () => IState<K, AppEvent>;
export type AppStateMachine = ICanStatesRegister<AppSTATEid, AppEvent, AppContext>
							  & ICanStateChange<AppSTATEid, AppEvent>;