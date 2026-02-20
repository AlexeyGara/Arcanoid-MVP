/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Chesstles-TS
 * File: TransitionError.ts
 * Path: src/core/errors/
 * Author: alexeygara
 * Last modified: 2026-01-20 20:50
 */

export class StateMachineTransitionError extends Error {

	readonly nextStateId:STATEidBase;
	readonly cause:unknown;

	constructor(nextStateId:STATEidBase, message?:string, originCause?:unknown) {
		super(message);
		this.nextStateId = nextStateId;
		this.cause       = originCause;
	}
}