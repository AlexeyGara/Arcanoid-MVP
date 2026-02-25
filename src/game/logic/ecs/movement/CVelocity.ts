/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: CVelocity.ts
 * Path: src/game/logic/ecs/movement/
 * Author: alexeygara
 * Last modified: 2026-02-25 15:40
 */

export class CVelocity {

	velX:number;
	velY:number;

	constructor(
		velX:number = 0,
		velY:number = 0
	) {
		this.velX = velX;
		this.velY = velY;
	}
}