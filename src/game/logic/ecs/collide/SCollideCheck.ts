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
	BOARD_COLLIDE_ACTIVE_STATE_DURATION_MS,
	CollideCheckSectorIndex,
	defineCollideSector,
	ViewState
}                                 from "game/logic/ecs";
import { CBall }                  from "game/logic/ecs/bal/CBall";
import { CInputControlled }       from "game/logic/ecs/input/CInputControlled";
import {
	getIntersection,
	TEMP_POINT_1,
	TEMP_POINT_2,
	TEMP_POINT_3,
	TEMP_POINT_4,
	TEMP_POINT_OUT
}                                 from "game/logic/ecs/math";
import { CPosition }              from "game/logic/ecs/position/CPosition";
import { CViewState }             from "game/logic/ecs/view/CViewState";
import { CCollided }              from "./CCollided";
import { CRigidBody }             from "./CRigidBody";

export class SCollideCheck

	implements System {

	private readonly _world:World;
	private readonly _queryRigid:Query;
	private readonly _queryBalls:Query;
	private readonly _collideSectorsMap:CollideSectorsMap;
	private readonly _gamefieldArea:Rectangle<number>;

	constructor(
		world:World,
		collideSectorsMap:CollideSectorsMap,
		gamefieldArea:Rectangle<number>
	) {
		this._world             = world;
		this._gamefieldArea     = gamefieldArea;
		this._queryRigid        = world.createQuery([CRigidBody, CPosition]);
		this._queryBalls        = world.createQuery([CBall, CPosition]);
		this._collideSectorsMap = collideSectorsMap;
	}

	update(_:number):void {

		for(const ballEntity of this._queryBalls.entities) {

			const ballPos = this._world.getComponent(ballEntity, CPosition);
			const ball    = this._world.getComponent(ballEntity, CBall);
			if(ballPos.sectorId == CollideCheckSectorIndex.NOT_SET) {
				ballPos.sectorId = defineCollideSector(ballPos, this._collideSectorsMap);
			}

			const outOfAreaCheck = this._checkBallInArea(ballPos);
			if(outOfAreaCheck) {
				const cColl = this._world.hasComponent(ballEntity, CCollided)
							  ? this._world.getComponent(ballEntity, CCollided)
							  : this._world.addComponent(ballEntity, new CCollided());
				logger.log(`add CCollided: to ball (out area)`);
				cColl.collidePos      = outOfAreaCheck[0];
				cColl.collideVertical = outOfAreaCheck[1];

				// there is no need to check anymore if ball out of area
				continue;
			}

			for(const entity of this._queryRigid.entities) {
				const cPos   = this._world.getComponent(entity, CPosition);
				const cRigid = this._world.getComponent(entity, CRigidBody);
				if(cPos.sectorId == CollideCheckSectorIndex.NOT_SET) {
					cPos.sectorId = defineCollideSector(cPos, this._collideSectorsMap);
				}

				const collideCheck = this._checkCollide(cPos, cRigid, ballPos, ball);
				if(!collideCheck) {
					continue;
				}

				let cColl = this._world.hasComponent(ballEntity, CCollided)
							? this._world.getComponent(ballEntity, CCollided)
							: this._world.addComponent(ballEntity, new CCollided());
				logger.log(`add CCollided: to ball (collide with: '${entity}')`);
				cColl.collidedWith    = entity;
				cColl.collidePos      = collideCheck[0];
				cColl.collideVertical = collideCheck[1];

				cColl = this._world.hasComponent(entity, CCollided)
						? this._world.getComponent(entity, CCollided)
						: this._world.addComponent(entity, new CCollided());
				logger.log(`add CCollided: to rigid (ball: '${ballEntity}')`);
				cColl.collidedWith = ballEntity;

				if(this._world.hasComponent(entity, CInputControlled) && this._world.hasComponent(entity, CViewState)) {
					const cState = this._world.getComponent(entity, CViewState);
					if(cState) {
						cState.state           = ViewState.ACTIVE;
						cState.stateDurationMs = Math.max(cState.stateDurationMs,
														  BOARD_COLLIDE_ACTIVE_STATE_DURATION_MS);
					}
				}

				// collide only one rigid body
				break;
			}
		}
	}

	exit():void {

		this._world.removeQuery(this._queryRigid);
		this._world.removeQuery(this._queryBalls);
	}

	private _checkBallInArea(ballPos:CPosition):false | [Point<number>, boolean] {

		if(ballPos.posX < this._gamefieldArea.x) {
			return [{ x: ballPos.posX, y: ballPos.posY }, true];
		}

		if(ballPos.posX > this._gamefieldArea.x + this._gamefieldArea.width) {
			return [{ x: ballPos.posX, y: ballPos.posY }, true];
		}

		if(ballPos.posY < this._gamefieldArea.y) {
			return [{ x: ballPos.posX, y: ballPos.posY }, false];
		}

		if(ballPos.posY > this._gamefieldArea.y + this._gamefieldArea.height) {
			return [{ x: ballPos.posX, y: ballPos.posY }, false];
		}

		return false;
	}

	private _checkCollide(cRigidPos:CPosition, cRigid:CRigidBody, ballPos:CPosition,
						  ball:CBall):false | [Point<number>, boolean] {

		if(cRigidPos.sectorId != ballPos.sectorId) {
			//return false;
		}

		if(ballPos.posX < cRigidPos.posX - cRigid.boxWidth * 0.5 - ball.radius ||
		   ballPos.posX > cRigidPos.posX + cRigid.boxWidth * 0.5 + ball.radius) {
			return false;
		}

		if(ballPos.posY < cRigidPos.posY - cRigid.boxHeight * 0.5 - ball.radius ||
		   ballPos.posY > cRigidPos.posY + cRigid.boxHeight * 0.5 + ball.radius) {
			return false;
		}

		TEMP_POINT_1.x = ballPos.prePosX;
		TEMP_POINT_1.y = ballPos.prePosY;
		TEMP_POINT_2.x = ballPos.posX;
		TEMP_POINT_2.y = ballPos.posY;

		//left edge of block
		TEMP_POINT_3.x = TEMP_POINT_4.x = cRigidPos.posX - cRigid.boxWidth * 0.5 - ball.radius;
		TEMP_POINT_3.y = cRigidPos.posY - cRigid.boxHeight * 0.5 - ball.radius;
		TEMP_POINT_4.y = cRigidPos.posY + cRigid.boxHeight * 0.5 + ball.radius;

		let result = getIntersection(TEMP_POINT_1, TEMP_POINT_2, TEMP_POINT_3, TEMP_POINT_4, TEMP_POINT_OUT);
		if(result) {
			return [{ ...result }, true];
		}

		//right edge of block
		TEMP_POINT_3.x = TEMP_POINT_4.x = cRigidPos.posX + cRigid.boxWidth * 0.5 + ball.radius;
		TEMP_POINT_3.y = cRigidPos.posY - cRigid.boxHeight * 0.5 - ball.radius;
		TEMP_POINT_4.y = cRigidPos.posY + cRigid.boxHeight * 0.5 + ball.radius;

		result = getIntersection(TEMP_POINT_1, TEMP_POINT_2, TEMP_POINT_3, TEMP_POINT_4, TEMP_POINT_OUT);
		if(result) {
			return [{ ...result }, true];
		}

		//top edge of block
		TEMP_POINT_3.x = cRigidPos.posX - cRigid.boxWidth * 0.5 - ball.radius;
		TEMP_POINT_4.x = cRigidPos.posX + cRigid.boxWidth * 0.5 + ball.radius;
		TEMP_POINT_3.y = TEMP_POINT_4.y = cRigidPos.posY - cRigid.boxHeight * 0.5 - ball.radius;

		result = getIntersection(TEMP_POINT_1, TEMP_POINT_2, TEMP_POINT_3, TEMP_POINT_4, TEMP_POINT_OUT);
		if(result) {
			return [{ ...result }, false];
		}

		//bottom edge of block
		TEMP_POINT_3.x = cRigidPos.posX - cRigid.boxWidth * 0.5 - ball.radius;
		TEMP_POINT_4.x = cRigidPos.posX + cRigid.boxWidth * 0.5 + ball.radius;
		TEMP_POINT_3.y = TEMP_POINT_4.y = cRigidPos.posY + cRigid.boxHeight * 0.5 + ball.radius;

		result = getIntersection(TEMP_POINT_1, TEMP_POINT_2, TEMP_POINT_3, TEMP_POINT_4, TEMP_POINT_OUT);
		if(result) {
			return [{ ...result }, false];
		}

		logger.warn(
			`!!! INTERSECTION CHECK ERROR !!! (${cRigidPos.posX},${cRigidPos.posY}; ${cRigid.boxWidth}x${cRigid.boxHeight})`);

		return false;
	}

}