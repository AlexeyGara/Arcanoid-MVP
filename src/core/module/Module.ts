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
	SoundStarter
}                                  from "@core-api/audio-types";
import type { IGameLoopUpdatable } from "@core-api/gameloop-types";
import type {
	IControl,
	IModel,
	IModule,
	IView,
	LightWeightModelBase
}                                  from "@core-api/module-types";
import type { ISceneHost }         from "@core-api/scene-types";
import type { IResizeManager }     from "@core-api/service-types";

export abstract class Module<TEvents extends EventBase,
	TTargetLayerId extends SceneLayersIdBase,
	TModelDTO extends LightWeightModelBase = LightWeightModelBase>
	implements IModule<TEvents, TTargetLayerId> {

	protected get actionStarter():ActionStarter {
		return this._actionManager;
	}

	protected get animationStarter():IAnimationPlayer {
		return this._animationManager;
	}

	protected get soundStarter():SoundStarter {
		return this._soundManager;
	}

	get active():boolean {
		return this._active;
	}

	readonly destroyed:boolean = false;

	private readonly _model:IModel<TModelDTO>;
	private readonly _views:IView<TTargetLayerId, TModelDTO>[];
	private readonly _control:IControl<typeof this._model, typeof this._views[number], TTargetLayerId, TModelDTO>;
	private readonly _actionManager:IActionManager;
	private readonly _animationManager:IAnimationManager;
	private readonly _soundManager:ISoundManager;
	private readonly _soundVoice:IVolumeManager;
	private readonly _resizeManager:IResizeManager;
	private _active:boolean = false;

	protected constructor(
		model:IModel<TModelDTO>,
		views:IView<TTargetLayerId, TModelDTO>[],
		control:IControl<typeof model, typeof views[number], TTargetLayerId, TModelDTO>,
		resizeManager:IResizeManager,
		actionSystemProvider:() => IActionManager,
		animationSystemProvider:() => IAnimationManager,
		soundSystemProvider:() => [ISoundManager, IVolumeManager]
	) {
		this._model = model;
		this._views = views;
		this._control = control;
		this._resizeManager = resizeManager;
		this._actionManager = actionSystemProvider();
		this._animationManager = animationSystemProvider();
		[this._soundManager, this._soundVoice] = soundSystemProvider();
	}

	attachToScene(scene:ISceneHost<TTargetLayerId>):void {
		for(const view of this._views) {
			view.onBeforeAttach?.();

			scene.add(view);

			if(view.onResize) {
				this._resizeManager.addListener(view);
			}

			//TODO: maybe need to implement layout for view, for example: this.layout?.apply(scene, views);

			view.onAttached?.(this.animationStarter);
		}

		scene.addToUpdateLoop(...this.getUpdatableMembers());
	}

	detachFromScene(scene:ISceneHost<TTargetLayerId>):void {
		scene.removeFromUpdateLoop(...this.getUpdatableMembers());

		for(const view of this._views) {
			this._resizeManager.removeListener(view);

			scene.remove(view);

			view.onDetached?.();
		}
	}

	async doEnter(payload?:TEvents[keyof TEvents]):Promise<void> {
		if(payload) {
			this.applyPayload?.(payload);
		}
		const fadeInAction = this.getFadeInAction?.(this._soundVoice);
		if(fadeInAction) {
			await this.actionStarter.start(fadeInAction);
		}
	}

	protected applyPayload?(payload:TEvents[keyof TEvents]):void;

	protected getFadeInAction?(soundsVolumeManager:IVolumeManager):IAction & CanBeUpdate;

	activate():void {
		if(this._active) {
			return;
		}

		this._active = true;

		this.doStart();
	}

	protected doStart():void {
		this._control.start(this.actionStarter, [this.soundStarter, this._soundVoice]);
	}

	deactivate():void {
		if(!this._active) {
			return;
		}

		this.doStop();

		this._active = false;
	}

	protected doStop():void {
		this._control.stop();
	}

	async doExit():Promise<void> {
		const fadeOutAction = this.getFadeOutAction?.(this._soundVoice);
		if(fadeOutAction) {
			await this.actionStarter.start(fadeOutAction);
		}

		this._soundVoice.mute();
		this._soundManager.stopAll();
		this._actionManager.cancelAll();
		this._animationManager.cancelAll();
	}

	protected getFadeOutAction?(soundsVolumeManager:IVolumeManager):IAction & CanBeUpdate;

	protected getUpdatableMembers():IGameLoopUpdatable[] {
		return [
			...this._views.filter((view) => !!view.update),
			...[this._control].filter((control) => !!control.update)
		];
	}

	destroy():void {
		this._control.destroy();

		for(const view of this._views) {
			view.destroy();
		}

		this._model.destroy();

		(this.destroyed as Writeable<boolean>) = true;
	}

}