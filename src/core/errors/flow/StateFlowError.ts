/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Chesstles-TS
 * File: StateFlowError.ts
 * Path: src/core/errors/fsm/
 * Author: alexeygara
 * Last modified: 2026-01-21 11:42
 */

export class StateFlowError extends Error {

	readonly stateId:STATEidBase;

	constructor(stateId:STATEidBase, message?:string) {
		super(message);
		this.stateId = stateId;
	}
}