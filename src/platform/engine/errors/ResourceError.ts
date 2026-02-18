/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: ResourceError.ts
 * Path: src/platform/engine/errors/
 * Author: alexeygara
 * Last modified: 2026-02-17 22:22
 */

import type { SceneResourceType } from "@platform/engine/resources";

export class ResourceError extends Error {

	readonly resourceId:string;
	readonly resourceType:SceneResourceType;

	constructor(resourceId:string, resourceType:SceneResourceType, message?:string) {
		super(message);
		this.resourceId = resourceId;
		this.resourceType = resourceType;
	}
}