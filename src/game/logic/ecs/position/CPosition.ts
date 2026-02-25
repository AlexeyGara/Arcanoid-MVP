/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: CPosition.ts
 * Path: src/game/logic/ecs/position/
 * Author: alexeygara
 * Last modified: 2026-02-25 15:39
 */

import { CollideCheckSectorIndex } from "game/logic/ecs";

export class CPosition {

	posX:number;
	posY:number;
	sectorId:CollideCheckSectorIndex;
	prePosX:number;
	prePosY:number;

	constructor(
		posX:number                      = 0,
		posY:number                      = 0,
		sectorId:CollideCheckSectorIndex = CollideCheckSectorIndex.NOT_SET
	) {
		this.posX     = posX;
		this.posY     = posY;
		this.sectorId = sectorId;
		this.prePosX  = this.posX;
		this.prePosY  = this.posY;
	}
}