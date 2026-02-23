/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Chesstles-TS
 * File: ResourcesLoadingError.ts
 * Path: src/core/errors/fsm/flow/
 * Author: alexeygara
 * Last modified: 2026-01-21 12:19
 */

import { SceneFlowError } from "core/errors/flow/SceneFlowError";

export class ScenePreLoadingError extends SceneFlowError {

	constructor(sceneId:SceneIdBase, message?:string) {
		super(sceneId, message);
	}
}