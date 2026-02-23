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

export type KeyCode = string | number;

export type KeyInputData<TKeyCode extends KeyCode> = {

	readonly keyCode:TKeyCode;

	isDown?:boolean;
	lastDownDurationMs?:number;

	downCounter?:number;
	upCounter?:number;
}

export interface IKeyInputDispatcher<TKeyCode extends KeyCode, TKeyEventEmitterId extends SceneChildIdBase> {

	isKeyRegistered(inputDataStorage:KeyInputData<TKeyCode>, emitterId?:TKeyEventEmitterId):boolean;

	registerKey(inputDataStorage:KeyInputData<TKeyCode>, emitterId?:TKeyEventEmitterId):void;

	deregisterKey(inputDataStorage:KeyInputData<TKeyCode>, emitterId?:TKeyEventEmitterId):void;
}

export type KeyInputManager<TKeyCode extends KeyCode = KeyCode, TKeyEventEmitterId extends SceneChildIdBase = SceneChildIdBase>
	= GameLoopPhaseActor<typeof GameLoopPhase.INPUT> &
	  IKeyInputDispatcher<TKeyCode, TKeyEventEmitterId> & {

		  unregisterAll():void;
	  };

export type TouchType = "pointer";

export type TouchInputData<TTouchType extends TouchType> = {

	readonly touchType:TTouchType;

	isContinue?:boolean;
	lastContinueDurationMs?:number;

	startX?:number;
	startY?:number;

	currX?:number;
	currY?:number;

	endX?:number;
	endY?:number;
}

export interface ITouchInputDispatcher<TTouchType extends TouchType, TTouchEventEmitterId extends SceneChildIdBase> {

	isTouchRegistered(inputDataStorage:TouchInputData<TTouchType>, emitterId?:TTouchEventEmitterId):boolean;

	registerTouch(inputDataStorage:TouchInputData<TTouchType>, emitterId?:TTouchEventEmitterId):void;

	deregisterTouch(inputDataStorage:TouchInputData<TTouchType>, emitterId?:TTouchEventEmitterId):void;
}

export type TouchInputManager<TTouchType extends TouchType = TouchType, TTouchEventEmitterId extends SceneChildIdBase = SceneChildIdBase>
	= GameLoopPhaseActor<typeof GameLoopPhase.INPUT> &
	  ITouchInputDispatcher<TTouchType, TTouchEventEmitterId> & {

		  unregisterAll():void;
	  };