/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Chesstles-TS
 * File: ResourcesLoadingError.ts
 * Path: src/core/errors/fsm/flow/
 * Author: alexeygara
 * Last modified: 2026-01-21 12:19
 */

export class ScenePreLoadingError extends Error {

	readonly resourcesForScene:SceneIdBase;

	constructor(sceneId:SceneIdBase, message?:string) {
		super(message);
		this.resourcesForScene = sceneId;
	}
}