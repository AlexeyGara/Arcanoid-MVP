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
}                    from "@releaseband/ecs";
import {
	BALL_VELOCITY_MAX,
	stableBallVelocityY
}                    from "game/logic/ecs";
import { CVelocity } from "game/logic/ecs/movement/CVelocity";
import { CBall }     from "./CBall";

export class SLaunchBall

	implements System {

	private readonly _world:World;
	private readonly _query:Query;

	constructor(
		world:World
	) {
		this._world = world;
		this._query = world.createQuery([CBall, CVelocity]);

		this._query.onAddSubscribe(this._onBallAdded);
	}

	exit():void {

		this._query.onAddUnsubscribe(this._onBallAdded);
		this._world.removeQuery(this._query);
	}

	private _onBallAdded = (ballEntity:number):void => {

		const cVel = this._world.getComponent(ballEntity, CVelocity);

		cVel.velX = -BALL_VELOCITY_MAX.x / 2 + BALL_VELOCITY_MAX.x * Math.random();
		cVel.velY = BALL_VELOCITY_MAX.y;

		stableBallVelocityY(cVel);
	};

}