/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: OverlayStrategyProvider.ts
 * Path: src/core/fsm/strategy/
 * Author: alexeygara
 * Last modified: 2026-02-19 22:01
 */

import type {
	IState,
	ITransitionStrategy
}                                   from "@core-api/fsm-types";
import { StateOverlayMode }         from "core/fsm/state/StateOverlayMode";
import { OverlayForbidden }         from "core/fsm/strategy/OverlayForbidden";
import { OverlayThroughExit }       from "core/fsm/strategy/OverlayThroughExit";
import { OverlayThroughInactivate } from "core/fsm/strategy/OverlayThroughInactivate";
import { OverlayThroughPause }      from "core/fsm/strategy/OverlayThroughPause";

export const overlayStrategiesProvider = <TSTATEid extends STATEidBase, TEvents extends EventBase>(
	overlayMode:StateOverlayMode
):ITransitionStrategy<TSTATEid, TEvents> => {

	switch(overlayMode) {
		case StateOverlayMode.FORBIDDEN:
			return new OverlayForbidden();

		case StateOverlayMode.PAUSE:
			return new OverlayThroughPause();

		case StateOverlayMode.INACTIVE:
			return new OverlayThroughInactivate();

		case StateOverlayMode.EXIT:
			return new OverlayThroughExit();

		default:
			assertNever(overlayMode);
	}
};

export const processStatesClosing = async <TSTATEid extends STATEidBase, TEvents extends EventBase>(
	statesToClose:IState<TSTATEid, TEvents>[],
	overlayCompleteCallback?:() => Promise<void>,
	completeCallback?:() => void
):Promise<void> => {

	// stop all states:

	for(const state of statesToClose) {
		state.stop();
	}

	// exit & detach overlay-states:

	for(const state of statesToClose) {
		if(state.isOverlay) {
			await state.exit();
		}
	}

	for(const state of statesToClose) {
		if(state.isOverlay) {
			state.detach();
		}
	}

	await overlayCompleteCallback?.();

	// exit & detach other not-overlay-states:

	const waiters:Promise<void>[] = [];
	for(const state of statesToClose) {
		if(!state.isOverlay) {
			waiters.push(state.exit());
		}
	}
	await Promise.all(waiters);

	for(const state of statesToClose) {
		if(!state.isOverlay) {
			state.detach();
		}
	}

	completeCallback?.();
};
