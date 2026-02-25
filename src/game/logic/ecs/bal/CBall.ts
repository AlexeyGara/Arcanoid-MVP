/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: CBall.ts
 * Path: src/game/logic/ecs/bal/
 * Author: alexeygara
 * Last modified: 2026-02-25 17:24
 */

import { DEFAULT_BALL_RADIUS } from "game/logic/ecs";

export class CBall {

	radius:number;

	constructor(
		radius?:number
	) {
		this.radius = radius || DEFAULT_BALL_RADIUS;
	}
}