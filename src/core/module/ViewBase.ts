/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: View.ts
 * Path: src/core/module/
 * Author: alexeygara
 * Last modified: 2026-01-22 11:26
 */

import type { IAnimationPlayer }     from "@core-api/animation-types";
import type { GameTime }             from "@core-api/gameloop-types";
import type { LightWeightModelBase } from "@core-api/module-types";
import type { ResizeInfo }           from "@core-api/service-types";
import type { IViewImpl }            from "@core-api/view-impl-types";
import type { IView }                from "@core-api/view-types";
import { GameLoopPhase }             from "core/gameloop/GameLoopPhase";

export abstract class ViewBase<TTargetLayerId extends SceneLayersIdBase,
	TViewId extends SceneChildIdBase,
	TModelDTO extends LightWeightModelBase = LightWeightModelBase>

	implements IView<TTargetLayerId, TViewId, TModelDTO> {

	@final
	readonly updatePhase = GameLoopPhase.VIEW;

	abstract readonly uniqueOwnId:TViewId;

	abstract readonly targetLayerId:TTargetLayerId;

	abstract readonly destroyed:boolean;

	abstract readonly fullyImplDispose:boolean;

	private readonly _viewImplProvider?:(viewId:TViewId) => IViewImpl<TViewId>;
	private _viewImpl?:IViewImpl<TViewId>;

	protected constructor(
		viewImplProvider?:(viewId:TViewId) => IViewImpl<TViewId>,
	) {
		this._viewImplProvider = viewImplProvider;
	}

	onBeforeAttach():void {

		this._viewImpl = this._viewImplProvider?.(this.uniqueOwnId);
	}

	onAttached?(animationPlayer:IAnimationPlayer):void;

	@final
	onResize(resizeInfo:ResizeInfo):void {
		if(this.destroyed) {
			return;
		}

		this._viewImpl?.doResize?.(resizeInfo);
	}

	@final
	update(time:GameTime):void {
		if(this.destroyed) {
			return;
		}

		this.doUpdate?.(time);

		this._viewImpl?.doUpdate?.(time.deltaTimeMs);
	}

	protected doUpdate?(time:GameTime):void;

	@final
	destroy():void {
		if(this.destroyed) {
			return;
		}

		this.doDestroy?.();

		this._viewImpl?.doDestroy(this.fullyImplDispose);

		(this.destroyed as Writeable<boolean>) = true;
	}

	protected doDestroy?():void;

}