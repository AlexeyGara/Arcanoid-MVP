/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: SHealthProcess.ts
 * Path: src/game/logic/ecs/health/
 * Author: alexeygara
 * Last modified: 2026-02-25 20:54
 */

import type {
	Query,
	System,
	World
}                     from "@releaseband/ecs";
import {
	BLOCK_CRITICAL_HEALTH,
	DEFAULT_BLOCK_HEALTH_DAMAGE
}                     from "game/logic/ecs";
import { CBall }      from "game/logic/ecs/bal/CBall";
import { CCollided }  from "game/logic/ecs/collide/CCollided";
import { CRigidBody } from "game/logic/ecs/collide/CRigidBody";
import { CDestroy }   from "game/logic/ecs/health/CDestroy";
import { CHealth }    from "game/logic/ecs/health/CHealth";

export class SHealthProcess

	implements System {

	private readonly _world:World;
	private readonly _queryHealthyRigid:Query;
	private readonly _queryHealthyBall:Query;

	constructor(
		world:World
	) {
		this._world             = world;
		this._queryHealthyRigid = world.createQuery([CHealth, CRigidBody, CCollided]);
		this._queryHealthyBall  = world.createQuery([CHealth, CBall, CCollided]);
	}

	update(_:number):void {

		for(const rigid of this._queryHealthyRigid.entities) {

			const cCollide = this._world.getComponent(rigid, CCollided);
			const cHealth  = this._world.getComponent(rigid, CHealth);

			for(const collideWith of cCollide.collidedWith) {

				if(this._world.hasComponent(collideWith, CBall)) {
					this._processCollideRigidWithBall(cHealth, rigid);
				}
				else {
					this._processCollideRigidWith(/*cHealth, rigid*/);
				}
			}
		}

		for(const ball of this._queryHealthyBall.entities) {

			const cCollide = this._world.getComponent(ball, CCollided);
			const cHealth  = this._world.getComponent(ball, CHealth);

			for(const collideWith of cCollide.collidedWith) {

				if(this._world.hasComponent(collideWith, CRigidBody)) {
					this._processCollideBallWithRigid(cHealth/*, ball*/);
				}
				else {
					this._processCollideBallWith(cHealth/*, ball*/);
				}
			}
		}
	}

	exit():void {

		this._world.removeQuery(this._queryHealthyRigid);
		this._world.removeQuery(this._queryHealthyBall);
	}

	private _processCollideRigidWithBall(cHealth:CHealth, rigidEntity:number):void {

		const isCritical = cHealth.health <= BLOCK_CRITICAL_HEALTH;

		cHealth.health = Math.max(0, cHealth.health - DEFAULT_BLOCK_HEALTH_DAMAGE);

		if(!cHealth.health) {
			if(isCritical) {
				this._world.removeComponent(rigidEntity, CCollided);
			}
			this._world.addComponent(rigidEntity, new CDestroy());
		}
	}

	private _processCollideRigidWith(/*cHealth:CHealth, rigidEntity:number*/):void {
		// nothing to do yet
	}

	private _processCollideBallWithRigid(_:CHealth/*, ballEntity:number*/):void {
		// nothing to do yet
	}

	private _processCollideBallWith(_:CHealth/*, ballEntity:number*/):void {
		// nothing to do yet
	}

}