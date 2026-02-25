/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: SMoveByInput.ts
 * Path: src/game/logic/ecs/movement/
 * Author: alexeygara
 * Last modified: 2026-02-25 15:45
 */

import type {
	Query,
	System,
	World
}                           from "@releaseband/ecs";
import {
	CONTROLLED_VELOCITY_X_MAX,
	DELTA_TIME_MULTIPLIER
}                           from "game/logic/ecs";
import { CInputControlled } from "game/logic/ecs/input/CInputControlled";
import { CVelocity }        from "game/logic/ecs/movement/CVelocity";

export class SInputToMove

	implements System {

	private readonly _world:World;
	private readonly _query:Query;

	constructor(
		world:World
	) {
		this._world = world;
		this._query = world.createQuery([CVelocity, CInputControlled]);
	}

	update(dt:number):void {

		for(const entity of this._query.entities) {
			const cInput = this._world.getComponent(entity, CInputControlled);
			const cVel   = this._world.getComponent(entity, CVelocity);

			const deltaTimeMs = dt * DELTA_TIME_MULTIPLIER;

			if(
				cInput.movingLeft[0] || cInput.movingLeft[1] ||
				cInput.lastMoveLeftDurationMs[0] > 0 || cInput.lastMoveLeftDurationMs[1] > 0
			) {
				cVel.velX += -CONTROLLED_VELOCITY_X_MAX;
				cVel.velX = Math.max(-CONTROLLED_VELOCITY_X_MAX, cVel.velX);
			}

			if(
				cInput.movingRight[0] || cInput.movingRight[1] ||
				cInput.lastMoveRightDurationMs[0] > 0 || cInput.lastMoveRightDurationMs[1] > 0
			) {
				cVel.velX += CONTROLLED_VELOCITY_X_MAX;
				cVel.velX = Math.min(CONTROLLED_VELOCITY_X_MAX, cVel.velX);
			}

			cInput.lastMoveLeftDurationMs[0] = Math.max(0, cInput.lastMoveLeftDurationMs[0] - deltaTimeMs);
			cInput.lastMoveLeftDurationMs[1] = Math.max(0, cInput.lastMoveLeftDurationMs[1] - deltaTimeMs);

			cInput.lastMoveRightDurationMs[0] = Math.max(0, cInput.lastMoveRightDurationMs[0] - deltaTimeMs);
			cInput.lastMoveRightDurationMs[1] = Math.max(0, cInput.lastMoveRightDurationMs[1] - deltaTimeMs);
		}

	}

	exit():void {

		this._world.removeQuery(this._query);
	}

}