/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: CRigidBody.ts
 * Path: src/game/logic/ecs/collide/
 * Author: alexeygara
 * Last modified: 2026-02-25 17:26
 */

export class CRigidBody {

	boxWidth:number;
	boxHeight:number;

	constructor(
		boxWidth:number,
		boxHeight:number
	) {
		this.boxWidth  = boxWidth;
		this.boxHeight = boxHeight;
	}
}