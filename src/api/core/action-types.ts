/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: action-types.ts
 * Path: src/api/core/
 * Author: alexeygara
 * Last modified: 2026-02-16 19:57
 */

import type { GameLoopPhase }      from "core/gameloop/GameLoopPhase";
import type { GameLoopPhaseActor } from "./gameloop-types";

export interface IActionManager extends GameLoopPhaseActor<typeof GameLoopPhase.LOGIC>,
										ActionStarter {

	cancelAllByTag(tag:string, withComplete?:boolean):void;

	cancelAll(withComplete?:boolean):void;
}

export type ActionStarter = {

	start(action:IAction & CanBeUpdate):Promise<OnFinishResult>;

	cancel(action:IAction, withComplete?:boolean):void;
}

export interface IAction {
	readonly id:string;
	readonly completed:boolean;
	readonly canceled:boolean;
	readonly progress:number;

	cancel(withComplete?:boolean):void;
}
