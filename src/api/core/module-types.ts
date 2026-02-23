/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: module-types.ts
 * Path: src/api/core/
 * Author: alexeygara
 * Last modified: 2026-02-18 09:17
 */

import type { ActionStarter }      from "@core-api/action-types";
import type { SoundsPlayback }     from "@core-api/audio-types";
import type { IDestroyable }       from "@core-api/base-types";
import type { IGameLoopUpdatable } from "@core-api/gameloop-types";
import type { ISceneHost }         from "@core-api/scene-types";
import type { IView }              from "@core-api/view-types";
import type { GameLoopPhase }      from "core/gameloop/GameLoopPhase";

export type HaveActivePhase = {

	readonly active:boolean;

	/** Activate: activate control, input, animations, etc. */
	activate():void;

	/** Deactivate: deactivate control, input, animations, etc. */
	deactivate():void;
}

export type HaveEnterPhase<TEvents extends EventBase> = {

	/** Apply payload-data and do preactivate procedures, like: start fade-in action and wait it finished */
	doEnter(payload:TEvents[keyof TEvents]):Promise<void>;

	/** Do after deactivate procedures, like: start fade-out action and wait it finished */
	doExit():Promise<void>;
}

export type HaveDestroyPhase = IDestroyable & {

	/** Destroy: destroy control, view, model, etc. */
	destroy():void;
}

export interface IModule<TEvents extends EventBase, TRootLayerId extends SceneLayersIdBase, TViewsId extends SceneChildIdBase>
	extends HaveActivePhase,
			HaveEnterPhase<TEvents>,
			HaveDestroyPhase {

	/** Attach module view to scene, add module to gameLoop live-circle */
	attachToScene(scene:ISceneHost<TRootLayerId, TViewsId>):void;

	/** Detach module view from scene, remove module from gameLoop live-circle */
	detachFromScene(scene:ISceneHost<TRootLayerId, TViewsId>):void;
}

export type ControlStrategy = {

	perform():Promise<void>;

	update(deltaTimeMs:number):void;
}

export interface IControl<TEvents extends EventBase, TModel extends IModel<TModelDTO>, TView extends IView<TRootLayerId, TViewId, TModelDTO>, TRootLayerId extends SceneLayersIdBase, TViewId extends SceneChildIdBase, TModelDTO extends LightWeightModelBase = LightWeightModelBase>
	extends IGameLoopUpdatable,
			HaveDestroyPhase {

	readonly updatePhase:typeof GameLoopPhase.LOGIC;

	readonly plainModel:DeepReadonly<TModelDTO>;

	readonly model:TModel;
	readonly views:TView[];

	/** Start control: subscribe to events, to inputs, start animations, etc. */
	start(actionStarter:ActionStarter, soundsPlayback:SoundsPlayback, payload:TEvents[keyof TEvents]):void;

	/** Stop control: unsubscribe from events, from inputs, finish animations, etc. */
	stop():void;
}

export interface IModel<TModelDTO extends LightWeightModelBase = LightWeightModelBase>
	extends HaveDestroyPhase {

	modelDTO:DeepReadonly<TModelDTO>;
}

type LWMPrimitiveData = string | number | boolean;
type LWModelData<T extends LWMPrimitiveData> = T;
type LWModelDataProvider<T extends LWMPrimitiveData> = () => LWModelData<T>;
type LightWeightModelDTO<T extends LWMPrimitiveData> = {
	[key:string]:LWModelData<T> | LWModelDataProvider<T> | LightWeightModelDTO<T>;
};

export type LightWeightModelBase<T extends LWMPrimitiveData = LWMPrimitiveData> = LightWeightModelDTO<T>
