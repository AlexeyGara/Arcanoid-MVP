/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: SInputTouch.ts
 * Path: src/game/logic/ecs/input/
 * Author: alexeygara
 * Last modified: 2026-02-25 14:34
 */

import type { TouchInputData } from "@core-api/input-types";
import type {
	Query,
	System,
	World
}                              from "@releaseband/ecs";
import { CInputControlled }    from "game/logic/ecs/input/CInputControlled";

const touchIndex = 1;

export class SInputTouch

	implements System {

	private readonly _leftTouch:TouchInputData;
	private readonly _rightTouch:TouchInputData;
	private readonly _world:World;
	private readonly _query:Query;

	constructor(
		world:World,
		leftTouchInput:TouchInputData,
		rightTouchInput:TouchInputData
	) {
		this._leftTouch  = leftTouchInput;
		this._rightTouch = rightTouchInput;
		this._world      = world;
		this._query      = world.createQuery([CInputControlled]);
	}

	update(_:number):void {

		for(const entity of this._query.entities) {
			const cInput = this._world.getComponent(entity, CInputControlled);

			cInput.movingLeft[touchIndex]             = !!this._leftTouch.isContinue && !this._rightTouch.isContinue;
			cInput.lastMoveLeftDurationMs[touchIndex] = this._leftTouch.lastContinueDurationMs || 0;

			cInput.movingRight[touchIndex]             = !!this._rightTouch.isContinue && !this._leftTouch.isContinue;
			cInput.lastMoveRightDurationMs[touchIndex] = this._rightTouch.lastContinueDurationMs || 0;
		}
	}

	exit():void {

		this._world.removeQuery(this._query);
	}

}