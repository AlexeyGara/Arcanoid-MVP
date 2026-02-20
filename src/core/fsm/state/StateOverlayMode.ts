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
	/** Disable any interaction, stop all logic & logic updates. */
	INACTIVE: 1,
	/** Stop and pause all: logic, actions, animations, sounds playback, except music */
	PAUSE: 2
} as const;

export type StateOverlayMode = typeof StateOverlayMode[keyof typeof StateOverlayMode];