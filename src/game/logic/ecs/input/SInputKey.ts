/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: SInput.ts
 * Path: src/game/logic/ecs/input/
 * Author: alexeygara
 * Last modified: 2026-02-25 14:28
 */

import type { KeyInputData } from "@core-api/input-types";
import type {
	Query,
	System,
	World
}                            from "@releaseband/ecs";
import { CInputControlled }  from "game/logic/ecs/input/CInputControlled";

const keyIndex = 1;

export class SInputKey

	implements System {

	private readonly _leftKey:KeyInputData;
	private readonly _rightKey:KeyInputData;
	private readonly _query:Query;
	private readonly _world:World;

	constructor(
		world:World,
		leftKeyInput:KeyInputData,
		rightKeyInput:KeyInputData
	) {
		this._leftKey  = leftKeyInput;
		this._rightKey = rightKeyInput;
		this._world    = world;
		this._query    = world.createQuery([CInputControlled]);
	}

	update(_:number):void {

		for(const entity of this._query.entities) {
			const cInput = this._world.getComponent(entity, CInputControlled);

			cInput.movingLeft[keyIndex]             = !!this._leftKey.isDown && !this._rightKey.isDown;
			cInput.lastMoveLeftDurationMs[keyIndex] = this._leftKey.lastDownDurationMs || 0;

			cInput.movingRight[keyIndex]             = !!this._rightKey.isDown && !this._leftKey.isDown;
			cInput.lastMoveRightDurationMs[keyIndex] = this._rightKey.lastDownDurationMs || 0;
		}
	}

	exit():void {

		this._world.removeQuery(this._query);
	}

}