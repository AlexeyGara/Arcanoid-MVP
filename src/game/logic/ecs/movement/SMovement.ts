/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: SMovement.ts
 * Path: src/game/logic/ecs/movement/
 * Author: alexeygara
 * Last modified: 2026-02-25 14:25
 */

import type {
	Query,
	System,
	World
}                                  from "@releaseband/ecs";
import { CollideCheckSectorIndex } from "game/logic/ecs";
import { CVelocity }               from "game/logic/ecs/movement/CVelocity";
import { CPosition }               from "game/logic/ecs/position/CPosition";

export class SMovement

	implements System {

	private readonly _world:World;
	private readonly _queryUpdatePos:Query;

	constructor(
		world:World,
	) {
		this._world          = world;
		this._queryUpdatePos = world.createQuery([CVelocity, CPosition]);
	}

	update(_:number):void {

		for(const entity of this._queryUpdatePos.entities) {
			const cVel = this._world.getComponent(entity, CVelocity);
			const cPos = this._world.getComponent(entity, CPosition);

			cPos.prePosX  = cPos.posX;
			cPos.prePosY  = cPos.posY;
			cPos.posX += cVel.velX;
			cPos.posY += cVel.velY;
			cPos.sectorId = CollideCheckSectorIndex.NOT_SET;
		}
	}

	exit():void {

		this._world.removeQuery(this._queryUpdatePos);
	}

}