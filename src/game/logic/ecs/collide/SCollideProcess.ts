/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: SCollideProcess.ts
 * Path: src/game/logic/ecs/collide/
 * Author: alexeygara
 * Last modified: 2026-02-26 00:24
 */

import type {
	Query,
	System,
	World
}                    from "@releaseband/ecs";
import { CBall }     from "game/logic/ecs/bal/CBall";
import { CCollided } from "game/logic/ecs/collide/CCollided";
import { CVelocity } from "game/logic/ecs/movement/CVelocity";
import { CPosition } from "game/logic/ecs/position/CPosition";

export class SCollideProcess

	implements System {

	private readonly _world:World;
	private readonly _queryBall:Query;

	constructor(
		world:World,
	) {
		this._world     = world;
		this._queryBall = world.createQuery([CBall, CCollided, CPosition]);
	}

	update(_:number):void {

		for(const ball of this._queryBall.entities) {
			const cCol = this._world.getComponent(ball, CCollided);

			for(const collideWith of [...cCol.collidedWith]) {
				cCol.collidedWith.delete(collideWith);
				if(!this._world.hasComponent(collideWith, CCollided)) {
					continue;
				}

				this._processBallReflect(ball, collideWith);
			}

		}
	}

	private _processBallReflect(ballEntity:number, collideWith:number):void {

		//TODO: implement

		const cBallPos = this._world.getComponent(ballEntity, CPosition);
		const cBallVel = this._world.getComponent(ballEntity, CVelocity);

		const cRigidPos = this._world.getComponent(collideWith, CPosition);

		const dx = cBallPos.posX - cBallPos.prePosX;
		const dy = cBallPos.posY - cBallPos.prePosY;

		const ballAngle = Math.atan2(dy, dx);
	}

}