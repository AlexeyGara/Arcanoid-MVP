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
}                           from "@releaseband/ecs";
import {
	BALL_COLLIDE_ACTIVE_STATE_DURATION_MS,
	BOARD_VELOCITY_X_TO_BALL_MULTIPLIER,
	stableBallVelocityY,
	ViewState
}                           from "game/logic/ecs";
import { CBall }            from "game/logic/ecs/bal/CBall";
import { CInputControlled } from "game/logic/ecs/input/CInputControlled";
import { CVelocity }        from "game/logic/ecs/movement/CVelocity";
import { CPosition }        from "game/logic/ecs/position/CPosition";
import { CViewState }       from "game/logic/ecs/view/CViewState";
import { CCollided }        from "./CCollided";

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

			this._world.removeComponent(ball, CCollided);
			logger.log(`remove CCollided: from ball (collide with: '${cCol.collidedWith}')`);

			const collideWith = cCol.collidedWith;
			delete cCol.collidedWith;

			//if(this._world.hasComponent(collideWith, CCollided)) {
			//}

			this._processBallReflect(ball, cCol.collidePos, cCol.collideVertical, collideWith);

		}
	}

	private _processBallReflect(ballEntity:number,
								collPos?:Point<number>, collVertical?:boolean,
								collideWith?:number):void {

		const cBallPos = this._world.getComponent(ballEntity, CPosition);
		const cBallVel = this._world.getComponent(ballEntity, CVelocity);

		if(collideWith !== undefined) {
			//const cRigidPos = this._world.getComponent(collideWith, CPosition);

		}

		//const dx = cBallPos.posX - cBallPos.prePosX;
		//const dy = cBallPos.posY - cBallPos.prePosY;
		//const ballAngle = Math.atan2(dy, dx);

		if(collPos) {
			cBallPos.posX = collPos.x;
			cBallPos.posY = collPos.y;
		}

		if(collVertical) {
			this._collideVertical(cBallVel);
		}
		else {
			this._collideHorizontal(cBallVel);
			if(collideWith !== undefined && this._world.hasComponent(collideWith, CInputControlled)) {
				const cVel = this._world.getComponent(collideWith, CVelocity);
				cBallVel.velX += cVel.velX * BOARD_VELOCITY_X_TO_BALL_MULTIPLIER;
			}
		}

		stableBallVelocityY(cBallVel);

		if(this._world.hasComponent(ballEntity, CViewState)) {
			const cState = this._world.getComponent(ballEntity, CViewState);
			if(cState) {
				cState.state           = ViewState.ACTIVE;
				cState.stateDurationMs = Math.max(cState.stateDurationMs,
												  BALL_COLLIDE_ACTIVE_STATE_DURATION_MS);
			}
		}
	}

	private _collideVertical(cBallVel:CVelocity):void {

		cBallVel.velX = -cBallVel.velX;
	}

	private _collideHorizontal(cBallVel:CVelocity):void {

		cBallVel.velY = -cBallVel.velY;
	}

}