/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: index.ts
 * Path: src/platform/engine/interraction/
 * Author: alexeygara
 * Last modified: 2026-02-17 23:22
 */

export const InteractEventType = {
	/** Fired when a pointer performs a quick tap. */
	POINTER_TAP: "pointertap",
	/** Fired when a pointer (mouse, pen, or touch) is pressed on a display object. */
	POINTER_DOWN: "pointerdown",
	/** Fired when the pointer is released over the display object. */
	POINTER_UP: "pointerup",
	/** Fired when the pointer is released outside the object that received pointerdown. */
	POINTER_UP_OUTSIDE: "pointerupoutside",
	/** Fired when the pointer moves over the display object. */
	POINTER_MOVE: "pointermove",
	/** Fired when the pointer enters the boundary of the display object. */
	POINTER_OVER: "pointerover",
	/** Fired when the pointer leaves the boundary of the display object. */
	POINTER_OUT: "pointerout",
	/** Fired when the pointer interaction is canceled (e.g. touch lost). */
	POINTER_CANCEL: "pointercancel"
} as const;

export type InteractEventType = typeof InteractEventType[keyof typeof InteractEventType];

export const InteractMode = {
	/** All interactions are fully disabled.
	 * - Ignores all interaction events, including children. Optimized for non-interactive elements.
	 * - For pure visual elements. */
	NONE: "none",
	/** (default) Does not emit events and ignores all hit testing on itself and non-interactive children.
	 * - Interactive children will still emit events.
	 * - Same as interactive = false. */
	PASSIVE: "passive",
	/** Does not emit events but is hit tested if parent is interactive.
	 * - Participates in hit testing only if a parent is interactive. Does not emit events. */
	AUTO: "auto",
	/** Emit events and is hit tested.
	 * - For standard UI elements. */
	STATIC: "static",
	/** Emits events and is hit tested but will also receive mock interaction events fired from a ticker.
	 * Extending "static" mode.
	 * Use it for better drug-n-drop experience.
	 * - Only when needed for moving/animated elements. */
	DYNAMIC: "dynamic"
} as const;

export type InteractMode = typeof InteractMode[keyof typeof InteractMode];