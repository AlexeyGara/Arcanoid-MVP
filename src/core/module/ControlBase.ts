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
	SoundsPlayback,
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

export abstract class ControlBase<TEvents extends EventBase,
	TModel extends IModel<TModelDTO>,
	TView extends IView<TTargetLayerId, TViewsId, TModelDTO>,
	TTargetLayerId extends SceneLayersIdBase,
	TViewsId extends SceneChildIdBase,
	TModelDTO extends LightWeightModelBase = LightWeightModelBase>

	implements IControl<TEvents, TModel, TView, TTargetLayerId, TViewsId, TModelDTO> {

	@final
	readonly updatePhase = GameLoopPhase.LOGIC;

	@final
	readonly destroyed:boolean = false;

	get plainModel():DeepReadonly<TModelDTO> {
		return this.model.modelDTO;
	}

	readonly model:TModel;
	readonly views:TView[];

	protected readonly actionStarter!:ActionStarter;
	protected readonly soundsStarter!:SoundStarter;
	protected readonly soundsVolume!:IVolumeManager;

	private readonly _activeStrategies:Set<ControlStrategy> = new Set();

	protected constructor(
		model:TModel,
		views:TView[],
	) {
		this.model = model;
		this.views = views;
	}

	@final
	start(actionStarter:ActionStarter, soundsPlayback:SoundsPlayback, payload:TEvents[keyof TEvents]):void {
		(this.actionStarter as Writeable<ActionStarter>) = actionStarter;
		(this.soundsStarter as Writeable<SoundStarter>)  = soundsPlayback[0];
		(this.soundsVolume as Writeable<IVolumeManager>) = soundsPlayback[1];

		this.doStart(payload);
	}

	protected abstract doStart(payload:TEvents[keyof TEvents]):void;

	@final
	stop():void {
		this.deactivateAllStrategies();

		this.doStop?.();
	}

	protected abstract doStop?():void;

	@final
	destroy():void {
		this._activeStrategies.clear();

		this.doDestroy?.();

		(this.destroyed as Writeable<boolean>) = true;
	}

	protected abstract doDestroy?():void;

	@final
	protected activateStrategy(strategy:ControlStrategy):void {
		if(this._activeStrategies.has(strategy)) {
			this._activeStrategies.delete(strategy);
		}
		this._activeStrategies.add(strategy);
	}

	@final
	protected deactivateStrategy(strategy:ControlStrategy):void {
		this._activeStrategies.delete(strategy);
	}

	@final
	protected deactivateAllStrategies():void {
		this._activeStrategies.clear();
	}

	@final
	update(timeMs:GameTime):void {
		if(this.destroyed) {
			return;
		}

		for(const strategy of this._activeStrategies) {
			strategy.update(timeMs.deltaTimeMs);
		}
	}

}