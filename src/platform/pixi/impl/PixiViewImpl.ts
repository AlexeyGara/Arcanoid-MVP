/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: PixiViewImpl.ts
 * Path: src/platform/pixi/scene/
 * Author: alexeygara
 * Last modified: 2026-02-23 18:10
 */

import type { ResizeInfo } from "@core-api/service-types";
import type { IViewImpl }  from "@core-api/view-impl-types";
import { PixiContainer }   from "@pixi/index";
import { setContainerId }  from "@pixi/utils";

export abstract class PixiViewImpl<TViewId extends SceneChildIdBase>
	extends PixiContainer

	implements IViewImpl<TViewId> {

	readonly uniqueId:TViewId;

	get stage():PixiContainer {
		return this;
	}

	private readonly _releaseAsset:() => void;

	protected constructor(
		id:TViewId,
		releaseAsset:() => void,
	) {
		super();
		this.uniqueId = id;
		setContainerId(this, id);
		this._releaseAsset = releaseAsset;
	}

	doUpdate?(deltaTimeMs:number):void;

	doResize?(resizeInfo:ResizeInfo):void;

	doDestroy(fullyDispose?:boolean):void {
		if(this.destroyed) {
			return;
		}

		this.beforeDestroy?.();

		this.destroy({
						 children:      true,
						 texture:       !!fullyDispose,
						 textureSource: !!fullyDispose,
						 context:       !!fullyDispose,
						 style:         !!fullyDispose
					 });

		this._releaseAsset();
	}

	protected beforeDestroy?():void;
}