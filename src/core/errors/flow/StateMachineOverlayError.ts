/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: StateMachineOverlayError.ts
 * Path: src/core/errors/flow/
 * Author: alexeygara
 * Last modified: 2026-02-19 21:38
 */

export class StateMachineOverlayError extends Error {

	readonly overlayStateId:STATEidBase;

	constructor(overlayStateId:STATEidBase, message?:string) {
		super(message);
		this.overlayStateId = overlayStateId;
	}
}