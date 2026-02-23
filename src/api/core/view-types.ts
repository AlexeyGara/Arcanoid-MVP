/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: view-types.ts
 * Path: src/api/core/
 * Author: alexeygara
 * Last modified: 2026-02-23 17:01
 */

import type { IAnimationPlayer }   from "@core-api/animation-types";
import type { IGameLoopUpdatable } from "@core-api/gameloop-types";
import type {
	HaveDestroyPhase,
	LightWeightModelBase
}                                  from "@core-api/module-types";
import type { IResizable }         from "@core-api/service-types";
import type { GameLoopPhase }      from "core/gameloop/GameLoopPhase";

export type CanBeAddToScene<TTargetLayerId extends SceneLayersIdBase, TOwnUniqueId extends SceneChildIdBase> = {

	/** The unique id of this child object (view) that should add at {@link targetLayerId}-layer of scene. */
	readonly uniqueOwnId:TOwnUniqueId;

	/** The unique layer id to add this child object (view). */
	readonly targetLayerId:TTargetLayerId;
}

export interface IView<TRootLayerId extends SceneLayersIdBase, TViewId extends SceneChildIdBase, TModelDTO extends LightWeightModelBase = LightWeightModelBase>
	extends CanBeAddToScene<TRootLayerId, TViewId>,
			IGameLoopUpdatable,
			IResizable,
			HaveDestroyPhase {

	readonly updatePhase:typeof GameLoopPhase.VIEW;

	onBeforeAttach?():void;

	onAttached?(animationPlayer:IAnimationPlayer):void;

	onDetached?():void;

	onModelUpdated?(model:DeepReadonly<TModelDTO>):void;
}