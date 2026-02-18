/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Chesstles-TS
 * File: Control.ts
 * Author: alexeygara
 * Last modified: 2026-01-05 19:44
 */

import type { ActionStarter } from "@core-api/action-types";
import type {
	IVolumeManager,
	SoundStarter
}                             from "@core-api/audio-types";
import type { GameTime }      from "@core-api/gameloop-types";
import type {
	ControlStrategy,
	IControl,
	IModel,
	IView,
	LightWeightModelBase
}                             from "@core-api/module-types";
import { GameLoopPhase }      from "core/gameloop/GameLoopPhase";

export abstract class ControlBase<TModel extends IModel<TModelDTO>,
	TView extends IView<TTargetLayerId, TModelDTO>,
	TTargetLayerId extends SceneLayersIdBase,
	TModelDTO extends LightWeightModelBase = LightWeightModelBase>
	implements IControl<TModel, TView, TTargetLayerId, TModelDTO> {

	get updatePhase():typeof GameLoopPhase.LOGIC {
		return GameLoopPhase.LOGIC;
	}

	protected get lightWeightModel():DeepReadonly<TModelDTO> {
		return this.model.modelDTO;
	}

	abstract readonly destroyed:boolean;

	readonly model:TModel;
	readonly views:TView[];
	private readonly _activeStrategies:Set<ControlStrategy> = new Set();

	protected constructor(
		model:TModel,
		views:TView[]
	) {
		this.model = model;
		this.views = views;
	}

	abstract start(actionStarter:ActionStarter, soundsPlayback:[SoundStarter, IVolumeManager]):void;

	abstract stop():void;

	abstract destroy():void;

	protected activateStrategy(strategy:ControlStrategy):void {
		if(this._activeStrategies.has(strategy)) {
			this._activeStrategies.delete(strategy);
		}
		this._activeStrategies.add(strategy);
	}

	protected deactivateStrategy(strategy:ControlStrategy):void {
		this._activeStrategies.delete(strategy);
	}

	protected deactivateAllStrategies():void {
		this._activeStrategies.clear();
	}

	update(timeMs:GameTime):void {
		if(this.destroyed) {
			return;
		}

		for(const strategy of this._activeStrategies) {
			strategy.update(timeMs.deltaTimeMs);
		}
	}

}