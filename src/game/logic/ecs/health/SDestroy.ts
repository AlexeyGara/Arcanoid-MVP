/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: CHealth.ts
 * Path: src/game/logic/ecs/health/
 * Author: alexeygara
 * Last modified: 2026-02-25 20:17
 */

import type {
	Query,
	System,
	World
}                   from "@releaseband/ecs";
import { CDestroy } from "./CDestroy";

export class SDestroy

	implements System {

	private readonly _world:World;
	private readonly _query:Query;

	constructor(
		world:World
	) {
		this._world = world;
		this._query = this._world.createQuery([CDestroy]);
	}

	exit():void {

		this._world.removeQuery(this._query);
	}

	update(_:number):void {

		for(const destroy of [...this._query.entities]) {

			this._world.removeEntity(destroy);
		}
	}

}