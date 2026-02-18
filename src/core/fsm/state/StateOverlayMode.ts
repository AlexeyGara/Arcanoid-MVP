/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: StateOverlayMode.ts
 * Path: src/core/fsm/state/
 * Author: alexeygara
 * Last modified: 2026-02-19 19:14
 */

export const StateOverlayMode = {
	/** Not an overlay by other states allowed. */
	FORBIDDEN: 0,
	/** Pause all: logic, actions, animations, sounds playback, except music.
	 * All this will be very easy to resume after the overlay mode ends. */
	PAUSE: 1,
	/** Stop any interaction and stop all logic.
	 * Need to restart it again when overlay mode ends. */
	INACTIVE: 2,
	/** Stop all logic, cancel all actions, cancel all animations, stop all sounds playback. */
	EXIT: 3
} as const;

export type StateOverlayMode = typeof StateOverlayMode[keyof typeof StateOverlayMode];