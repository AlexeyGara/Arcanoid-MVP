/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: SceneAttachPhaseError.ts
 * Path: src/core/errors/flow/
 * Author: alexeygara
 * Last modified: 2026-02-23 22:38
 */

import { SceneFlowError } from "core/errors/flow/SceneFlowError";

export class SceneAttachPhaseError extends SceneFlowError {

	readonly viewId:SceneChildIdBase;

	constructor(sceneId:SceneIdBase, viewId:SceneChildIdBase, message?:string) {
		super(sceneId, message);
		this.viewId = viewId;
	}
}