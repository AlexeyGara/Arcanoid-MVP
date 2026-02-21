/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: OverlayForbiddenStrategy.ts
 * Path: src/core/fsm/strategy/
 * Author: alexeygara
 * Last modified: 2026-02-19 22:06
 */

import type { ITransitionStrategy } from "@core-api/fsm-types";

export class OverlayForbidden<TSTATEid extends STATEidBase, TEvents extends EventBase>

	implements ITransitionStrategy<TSTATEid, TEvents> {

	constructor() {
	}

	doTransition():Promise<void> {

		// nothing to do

		return Promise.resolve();
	}
}