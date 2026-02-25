/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: SColladeCheck.ts
 * Path: src/game/logic/ecs/collide/
 * Author: alexeygara
 * Last modified: 2026-02-25 17:30
 */

import type {
	Query,
	System,
	World
}                                 from "@releaseband/ecs";
import type { CollideSectorsMap } from "game/logic/ecs";
import {
	CollideCheckSectorIndex,
	defineCollideSector
}                                 from "game/logic/ecs";
import { CBall }                  from "game/logic/ecs/bal/CBall";
import { CCollided }              from "game/logic/ecs/collide/CCollided";
import { CRigidBody }             from "game/logic/ecs/collide/CRigidBody";
import { CPosition }              from "game/logic/ecs/position/CPosition";

export class SCollideCheck

	implements System {

	private readonly _world:World;
	private readonly _queryRigid:Query;
	private readonly _queryBalls:Query;
	private readonly _collideSectorsMap:CollideSectorsMap;

	constructor(
		world:World,
		collideSectorsMap:CollideSectorsMap
	) {
		this._world             = world;
		this._queryRigid        = world.createQuery([CRigidBody, CPosition]);
		this._queryBalls        = world.createQuery([CBall, CPosition]);
		this._collideSectorsMap = collideSectorsMap;
	}

	update(_:number):void {

		for(const entity of this._queryRigid.entities) {

			const cPos   = this._world.getComponent(entity, CPosition);
			const cRigid = this._world.getComponent(entity, CRigidBody);
			if(cPos.sectorId == CollideCheckSectorIndex.NOT_SET) {
				cPos.sectorId = defineCollideSector(cPos, this._collideSectorsMap);
			}

			for(const ballEntity of this._queryBalls.entities) {

				const ballPos = this._world.getComponent(ballEntity, CPosition);
				const ball    = this._world.getComponent(ballEntity, CBall);
				if(ballPos.sectorId == CollideCheckSectorIndex.NOT_SET) {
					ballPos.sectorId = defineCollideSector(ballPos, this._collideSectorsMap);
				}

				if(this._checkCollide(cPos, cRigid, ballPos, ball)) {

					let cColl = this._world.getComponent(ballEntity, CCollided) || new CCollided();
					cColl.collidedWith.add(entity);
					this._world.addComponent(ballEntity, cColl);

					cColl = this._world.getComponent(entity, CCollided) || new CCollided();
					cColl.collidedWith.add(ballEntity);
					this._world.addComponent(entity, cColl);
				}
			}
		}
	}

	exit():void {

		this._world.removeQuery(this._queryRigid);
		this._world.removeQuery(this._queryBalls);
	}

	private _checkCollide(cPos:CPosition, cRigid:CRigidBody, ballPos:CPosition, ball:CBall):boolean {

		if(cPos.sectorId != ballPos.sectorId) {
			return false;
		}

		if(ballPos.posX - ball.radius < cPos.posX - cRigid.boxWidth * 0.5 ||
		   ballPos.posX + ball.radius > cPos.posX + cRigid.boxWidth * 0.5) {
			return false;
		}

		if(ballPos.posY - ball.radius < cPos.posY - cRigid.boxHeight * 0.5 ||
		   ballPos.posY + ball.radius > cPos.posY + cRigid.boxHeight * 0.5) {
			return false;
		}

		return true;
	}

}