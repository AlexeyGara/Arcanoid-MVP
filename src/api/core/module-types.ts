/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: module-types.ts
 * Path: src/api/core/
 * Author: alexeygara
 * Last modified: 2026-02-18 09:17
 */

import type { ActionStarter }      from "@core-api/action-types";
import type { IAnimationPlayer }   from "@core-api/animation-types";
import type {
	IVolumeManager,
	SoundStarter
}                                  from "@core-api/audio-types";
import type { IDestroyable }       from "@core-api/base-types";
import type { IGameLoopUpdatable } from "@core-api/gameloop-types";
import type { ISceneHost }         from "@core-api/scene-types";
import type { IResizable }         from "@core-api/service-types";
import type { GameLoopPhase }      from "core/gameloop/GameLoopPhase";

export type HaveActivePhase = {

	readonly active:boolean;

	activate():void;

	deactivate():void;
}

export type HaveEnterPhase<TEvents extends EventBase> = {

	doEnter(payload?:TEvents[keyof TEvents]):Promise<void>;

	doExit():Promise<void>;
}

export type HaveDestroyPhase = IDestroyable & {

	destroy():void;
}

export type CanBeAddToScene<TTargetLayerId extends SceneLayersIdBase> = {

	readonly targetLayerId:TTargetLayerId;
}

export interface IModule<TEvents extends EventBase, TRootLayerId extends SceneLayersIdBase>
	extends HaveActivePhase,
			HaveEnterPhase<TEvents>,
			HaveDestroyPhase {

	/** Attach module view to scene, add module to gameLoop live-circle */
	attachToScene(scene:ISceneHost<TRootLayerId>):void;

	/** Detach module view from scene, remove module from gameLoop live-circle */
	detachFromScene(scene:ISceneHost<TRootLayerId>):void;

	/** Apply payload-data and preactivate module, start fade-in action and wait it finished */
	doEnter(payload?:TEvents[keyof TEvents]):Promise<void>;

	/** Activate module - activate control, input, animations, etc. */
	activate():void;

	/** Deactivate module - deactivate control, input, animations, etc. */
	deactivate():void;

	/** Start fade-out action and wait it finished */
	doExit():Promise<void>;

	/** Destroy module - destroy control, view, etc. */
	destroy():void;
}

export type ControlStrategy = {

	perform():Promise<void>;

	update(deltaTimeMs:number):void;
}

export interface IControl<TModel extends IModel<TModelDTO>, TView extends IView<TRootLayerId, TModelDTO>, TRootLayerId extends SceneLayersIdBase, TModelDTO extends LightWeightModelBase = LightWeightModelBase>
	extends IGameLoopUpdatable,
			HaveDestroyPhase {

	readonly updatePhase:typeof GameLoopPhase.LOGIC;

	readonly model:TModel;
	readonly views:TView[];

	/** Start control: subscribe to events, to inputs, start animations, etc. */
	start(actionStarter:ActionStarter, soundsPlayback:[SoundStarter, IVolumeManager]):void;

	/** Stop control: unsubscribe from events, from inputs, finish animations, etc. */
	stop():void;

	destroy():void;
}

export interface IModel<TModelDTO extends LightWeightModelBase = LightWeightModelBase>
	extends HaveDestroyPhase {

	modelDTO:DeepReadonly<TModelDTO>;

	destroy():void;
}

type LWMPrimitiveData = string | number | boolean;
type LWModelData<T extends LWMPrimitiveData> = T;
type LWModelDataProvider<T extends LWMPrimitiveData> = () => LWModelData<T>;
type LightWeightModelDTO<T extends LWMPrimitiveData> = {
	[key:string]:LWModelData<T> | LWModelDataProvider<T> | LightWeightModelDTO<T>;
};

export type LightWeightModelBase<T extends LWMPrimitiveData = LWMPrimitiveData> = LightWeightModelDTO<T>

export interface IView<TRootLayerId extends SceneLayersIdBase, TModelDTO extends LightWeightModelBase = LightWeightModelBase>
	extends CanBeAddToScene<TRootLayerId>,
			IGameLoopUpdatable,
			IResizable,
			HaveDestroyPhase {

	readonly updatePhase:typeof GameLoopPhase.VIEW;

	onBeforeAttach?():void;

	onAttached?(animationPlayer:IAnimationPlayer):void;

	onDetached?():void;

	onModelUpdated?(model:DeepReadonly<TModelDTO>):void;

	destroy():void;
}
