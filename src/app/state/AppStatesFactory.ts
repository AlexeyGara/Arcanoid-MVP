/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: AppStatesFactory.ts
 * Path: src/app/state/
 * Author: alexeygara
 * Last modified: 2026-02-21 21:23
 */

import type { AppContext }      from "@app-api/app-types";
import type {
	IStatesFactory,
	StateProvider
}                               from "@core-api/fsm-types";
import type { AppEvent }        from "app/event/events";
import { MainMenuStateFactory } from "app/state/factories/MainMenuStateFactory";
import { AppSTATEid }           from "app/state/states";
import { MainMenuState }        from "app/state/states/MainMenuState";

export class AppStatesFactory

	implements IStatesFactory<AppSTATEid, AppEvent> {

	private readonly _appContext:AppContext;

	constructor(
		appContext:AppContext
	) {
		this._appContext = appContext;
	}

	getStateProvider<K extends AppSTATEid>(stateId:K):StateProvider<K, AppEvent> {

		switch(stateId) {

			case AppSTATEid.MAIN_MENU:
				return (
					() => new MainMenuState(new MainMenuStateFactory().provideStateContext(this._appContext))
				) as unknown as StateProvider<K, AppEvent>;

			default:
				assertNever(stateId);
		}
	}

}