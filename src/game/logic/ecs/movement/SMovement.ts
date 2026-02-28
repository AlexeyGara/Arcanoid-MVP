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
import { CRigidBody }              from "game/logic/ecs/collide/CRigidBody";
import { TEMP_POINT_1 }            from "game/logic/ecs/math";
import { CPosition }               from "game/logic/ecs/position/CPosition";
import { CVelocity }               from "./CVelocity";

export class SMovement

	implements System {

	private readonly _world:World;
	private readonly _queryUpdatePos:Query;
	private readonly _gamefieldArea:Rectangle<number>;

	constructor(
		world:World,
		gamefieldArea:Rectangle<number>
	) {
		this._world          = world;
		this._gamefieldArea  = gamefieldArea;
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

			if(this._world.hasComponent(entity, CRigidBody)) {
				const cRigid = this._world.getComponent(entity, CRigidBody);

				TEMP_POINT_1.x = cRigid.boxWidth / 2;
				TEMP_POINT_1.y = cRigid.boxHeight / 2;

				cPos.posX = Math.max(this._gamefieldArea.x + TEMP_POINT_1.x, cPos.posX);
				cPos.posX = Math.min(this._gamefieldArea.x + this._gamefieldArea.width - TEMP_POINT_1.x, cPos.posX);
				cPos.posY = Math.max(this._gamefieldArea.y + TEMP_POINT_1.y, cPos.posY);
				cPos.posY = Math.min(this._gamefieldArea.y + this._gamefieldArea.height - TEMP_POINT_1.y, cPos.posY);
			}
		}
	}

	exit():void {

		this._world.removeQuery(this._queryUpdatePos);
	}

}