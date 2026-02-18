/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Chesstles-TS
 * File: StateHandleEventError.ts
 * Path: src/core/errors/
 * Author: alexeygara
 * Last modified: 2026-01-20 20:59
 */

export class StateMachineHandleEventError extends Error {

	constructor(message?:string) {
		super(message);
	}
}