/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: Module.ts
 * Path: src/core/module/
 * Author: alexeygara
 * Last modified: 2026-01-22 22:26
 */

import type {
	ActionStarter,
	IAction,
	IActionManager
}                                  from "@core-api/action-types";
import type {
	IAnimationManager,
	IAnimationPlayer
}                                  from "@core-api/animation-types";
import type {
	ISoundManager,
	IVolumeManager,
	SoundsPlayback,
	SoundStarter
}                                  from "@core-api/audio-types";
import type { IGameLoopUpdatable } from "@core-api/gameloop-types";
import type {
	IControl,
	IModel,
	IModule,
	LightWeightModelBase
}                                  from "@core-api/module-types";
import type { ISceneHost }         from "@core-api/scene-types";
import type { IResizeManager }     from "@core-api/service-types";
import type { IView }              from "@core-api/view-types";

export class Module<TEvents extends EventBase,
	TTargetLayerId extends SceneLayersIdBase,
	TViewsId extends SceneChildIdBase,
	TModelDTO extends LightWeightModelBase = LightWeightModelBase>

	implements IModule<TEvents, TTargetLayerId, TViewsId> {

	@final
	protected get actionStarter():ActionStarter {
		return this._actionManager;
	}

	@final
	protected get animationPlayer():IAnimationPlayer {
		return this._animationManager;
	}

	@final
	protected get soundStarter():SoundStarter {
		return this._soundManager;
	}

	@final
	protected get soundVolume():IVolumeManager {
		return this._soundVoice;
	}

	@final
	protected get soundsPlayback():SoundsPlayback {
		return [this._soundManager, this._soundVoice];
	}

	@final
	get active():boolean {
		return this._active;
	}

	@final
	readonly destroyed:boolean = false;

	private readonly _model:IModel<TModelDTO>;
	private readonly _views:IView<TTargetLayerId, TViewsId, TModelDTO>[];
	private readonly _control:IControl<TEvents, typeof this._model, typeof this._views[number], TTargetLayerId, TViewsId, TModelDTO>;
	private readonly _actionManager:IActionManager;
	private readonly _animationManager:IAnimationManager;
	private readonly _soundManager:ISoundManager;
	private readonly _soundVoice:IVolumeManager;
	private readonly _resizeManager:IResizeManager;
	private _payload?:TEvents[keyof TEvents];
	private _active:boolean = false;

	protected constructor(
		model:IModel<TModelDTO>,
		views:IView<TTargetLayerId, TViewsId, TModelDTO>[],
		control:IControl<TEvents, typeof model, typeof views[number], TTargetLayerId, TViewsId, TModelDTO>,
		resizeManager:IResizeManager,
		actionManager:IActionManager,
		animationManager:IAnimationManager,
		soundSystem:[ISoundManager, IVolumeManager]
	) {
		this._model                            = model;
		this._views                            = views;
		this._control                          = control;
		this._resizeManager                    = resizeManager;
		this._actionManager                    = actionManager;
		this._animationManager                 = animationManager;
		[this._soundManager, this._soundVoice] = soundSystem;
	}

	@final
	attachToScene(scene:ISceneHost<TTargetLayerId, TViewsId>):void {

		for(const view of this._views) {
			view.onBeforeAttach?.();

			scene.add(view);

			if(view.onResize) {
				this._resizeManager.addListener(view);
			}

			//TODO: maybe need to implement layout for view, for example: this.layout?.apply(scene, views);

			view.onAttached?.(this.animationPlayer);
		}

		scene.addToUpdateLoop(...this.getUpdatableMembers());
	}

	@final
	async doEnter(payload:TEvents[keyof TEvents]):Promise<void> {

		this._payload = payload;

		this.applyPayload?.(payload);

		const fadeInAction = this.getFadeInAction?.(this.soundVolume);
		if(fadeInAction) {
			await this.actionStarter.start(fadeInAction);
		}
	}

	protected applyPayload?(payload:TEvents[keyof TEvents]):void;

	protected getFadeInAction?(soundsVolumeManager:IVolumeManager):IAction & CanBeUpdate;

	@final
	activate():void {

		if(this._active) {
			return;
		}

		this._active = true;

		this._control.start(this.actionStarter, this.soundsPlayback, this._payload!);

		this.doStart?.();
	}

	protected doStart?():void;

	@final
	deactivate():void {

		if(!this._active) {
			return;
		}

		this._control.stop();

		this.doStop?.();

		this._active = false;
	}

	protected doStop?():void;

	@final
	async doExit():Promise<void> {

		const fadeOutAction = this.getFadeOutAction?.(this.soundVolume);
		if(fadeOutAction) {
			await this.actionStarter.start(fadeOutAction);
		}

		this._soundManager.stopAll();
		this._actionManager.cancelAll();
		this._animationManager.cancelAll();
	}

	protected getFadeOutAction?(soundsVolumeManager:IVolumeManager):IAction & CanBeUpdate;

	@final
	detachFromScene(scene:ISceneHost<TTargetLayerId, TViewsId>):void {

		scene.removeFromUpdateLoop(...this.getUpdatableMembers());

		for(const view of this._views) {
			this._resizeManager.removeListener(view);

			scene.remove(view);

			view.onDetached?.();
		}
	}

	protected getUpdatableMembers():IGameLoopUpdatable[] {

		return [
			...this._views.filter((view) => !!view.update),
			...[this._control].filter((control) => !!control.update)
		];
	}

	@final
	destroy():void {

		this._control.destroy();

		for(const view of this._views) {
			view.destroy();
		}

		this._model.destroy();

		this.doDestroy?.();

		(this.destroyed as Writeable<boolean>) = true;
	}

	protected doDestroy?():void;

}