/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: View.ts
 * Path: src/core/module/
 * Author: alexeygara
 * Last modified: 2026-01-22 11:26
 */

import type { IAnimationPlayer } from "@core-api/animation-types";
import type { GameTime }         from "@core-api/gameloop-types";
import type {
	IView,
	LightWeightModelBase
}                                from "@core-api/module-types";
import type { ResizeInfo }       from "@core-api/service-types";
import { GameLoopPhase }         from "core/gameloop/GameLoopPhase";

export abstract class ViewBase<TTargetLayerId extends SceneLayersIdBase,
	TModelDTO extends LightWeightModelBase = LightWeightModelBase>
	implements IView<TTargetLayerId, TModelDTO> {

	readonly updatePhase = GameLoopPhase.VIEW;

	abstract readonly destroyed:boolean;

	abstract readonly targetLayerId:TTargetLayerId;

	protected constructor() {
	}

	onBeforeAttach?():void;

	onAttached?(animationPlayer:IAnimationPlayer):void;

	onResize?(resizeInfo:ResizeInfo):void;

	abstract update(time:GameTime):void;

	abstract destroy():void;

}