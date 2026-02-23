/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: view-impl.ts
 * Path: src/api/core/
 * Author: alexeygara
 * Last modified: 2026-02-23 17:00
 */

import type { IDestroyable } from "@core-api/base-types";
import type { ResizeInfo }   from "@core-api/service-types";

export interface IViewImpl<TViewId extends SceneChildIdBase>
	extends IDestroyable {

	/** The unique id of this child object (view) that should add at {@link targetLayerId}-layer of scene. */
	readonly uniqueId:TViewId;

	doUpdate?(deltaTimeMs:number):void;

	doResize?(resizeInfo:ResizeInfo):void;

	doDestroy(fullyDispose?:boolean):void;

}