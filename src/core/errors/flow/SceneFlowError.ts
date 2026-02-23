/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: SceneFlowError.ts
 * Path: src/core/errors/flow/
 * Author: alexeygara
 * Last modified: 2026-02-23 22:36
 */

export class SceneFlowError extends Error {

	readonly sceneId:SceneIdBase;

	constructor(sceneId:SceneIdBase, message?:string) {
		super(message);
		this.sceneId = sceneId;
	}
}