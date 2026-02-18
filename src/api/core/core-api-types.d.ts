/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: core-api-types.d.ts
 * Path: src/api/core/
 * Author: alexeygara
 * Last modified: 2026-02-17 15:31
 */

declare type CanBeUpdate = {
	update?(deltaTimeMs:number):void;
}

declare type OnFinishResult = "completed" | "cancelled";

declare type FinishAwait = {
	waitFinish():Promise<OnFinishResult>;
}

type EventPayloadData = undefined | string | number | boolean | Error;

declare type EventPayloadBase = Record<string, EventPayloadData | EventPayloadBase>;

declare type EventIdBase = string;

declare type EventBase = Record<EventIdBase, void | EventPayloadData | EventPayloadBase>;

declare type EventHandler<T> = (payload:T) => void;

declare type ResolveEventPayload<TEvents extends Record<string, EventPayloadBase>>
	= TEvents extends Record<string, infer TPayload> ? TPayload : never;

declare type EventHandlerDisposer = () => void;

declare type ViewPort =
	Readonly<Point<number>> &
	Readonly<Size<number>> & {
		readonly dpr:number;
	};

declare type STATEidBase = string;

declare type SceneIdPropsBase<TargetRootLayerId extends SceneLayersIdBase> = {
	readonly boot_preload:boolean;
	readonly cacheable:boolean;
	readonly targetRootLayer:TargetRootLayerId;
};

declare type SceneIdDataBase<TargetRootLayerId extends SceneLayersIdBase, TSceneLayersId extends SceneLayersIdBase>
	= SceneIdPropsBase<TargetRootLayerId> & {
	readonly sceneLayers:RootLayerConfig<TSceneLayersId>[];
};

declare type SceneIdBase = string;

declare type SceneBase<TargetRootLayerId extends SceneLayersIdBase> = Record<SceneIdBase, SceneIdDataBase<TargetRootLayerId>>;

declare type SceneLayersIdBase = string;

declare type SceneChildIdBase = string;

declare type ContextBase = Record<string, unknown>;

declare type EventsMap<TEvents extends EventBase> = {
	[P in keyof TEvents]:boolean
}
