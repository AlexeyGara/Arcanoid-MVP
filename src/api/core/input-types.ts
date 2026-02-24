/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: BlastGame_MVP-Cocos
 * File: input-types.ts
 * Path: assets/Script/app/core/api/
 * Author: alexeygara
 * Last modified: 2026-02-12 04:43
 */

import type { GameLoopPhaseActor } from "@core-api/gameloop-types";
import type { GameLoopPhase }      from "core/gameloop/GameLoopPhase";

export type HaveInteraction = {

	readonly interactive:boolean;

	enableInteraction():void;

	disableInteraction():void;
}

export type KeyCode = string;

export type KeyInputData = {

	readonly keyCode:KeyCode;

	isDown?:boolean;
	lastDownDurationMs?:number;

	downCounter?:number;
	upCounter?:number;
}

export interface IKeyInputDispatcher<TKeyEventEmitterId extends SceneChildIdBase> {

	isKeyRegistered(inputDataStorage:KeyInputData, emitterId?:TKeyEventEmitterId):boolean;

	registerKey(inputDataStorage:KeyInputData, emitterId?:TKeyEventEmitterId):void;

	deregisterKey(inputDataStorage:KeyInputData, emitterId?:TKeyEventEmitterId):void;
}

export type KeyInputManager<TKeyEventEmitterId extends SceneChildIdBase = SceneChildIdBase>
	= GameLoopPhaseActor<typeof GameLoopPhase.INPUT> &
	  IKeyInputDispatcher<TKeyEventEmitterId> & {

		  unregisterAll():void;
	  };

export type TouchType = "pointer";

export type TouchInputData = {

	readonly touchType:TouchType;

	isContinue?:boolean;
	lastContinueDurationMs?:number;

	startX?:number;
	startY?:number;

	currX?:number;
	currY?:number;

	endX?:number;
	endY?:number;
}

export interface ITouchInputDispatcher<TTouchEventEmitterId extends SceneChildIdBase> {

	isTouchRegistered(inputDataStorage:TouchInputData, emitterId?:TTouchEventEmitterId):boolean;

	registerTouch(inputDataStorage:TouchInputData, emitterId?:TTouchEventEmitterId):void;

	deregisterTouch(inputDataStorage:TouchInputData, emitterId?:TTouchEventEmitterId):void;
}

export type TouchInputManager<TTouchEventEmitterId extends SceneChildIdBase = SceneChildIdBase>
	= GameLoopPhaseActor<typeof GameLoopPhase.INPUT> &
	  ITouchInputDispatcher<TTouchEventEmitterId> & {

		  unregisterAll():void;
	  };