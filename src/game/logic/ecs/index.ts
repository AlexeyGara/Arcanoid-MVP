/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: index.ts
 * Path: src/game/logic/ecs/
 * Author: alexeygara
 * Last modified: 2026-02-25 15:56
 */

import type { CPosition } from "game/logic/ecs/position/CPosition";

export const DELTA_TIME_MULTIPLIER = 1;

export const MAX_ENTITIES_AT_WORLD = 1000;

export const CONTROLLED_VELOCITY_X_MAX = 1;

export const DEFAULT_BALL_RADIUS         = 10;
export const DEFAULT_BLOCK_HEALTH        = 1;
/** Critical block's health when block is immediately collapsed during collide with ball.
 * And ball will not be reflected! */
export const BLOCK_CRITICAL_HEALTH       = DEFAULT_BLOCK_HEALTH / 10;
export const DEFAULT_BLOCK_HEALTH_DAMAGE = 0.5;

export const CollideCheckSectorIndex = {
	NOT_SET: 0,

	A1: 1, A2: 2, A3: 3,
	B1: 4, B2: 5, B3: 6,
	C1: 7, C2: 8, C3: 9,
} as const;

export type CollideCheckSectorIndex = typeof CollideCheckSectorIndex[keyof typeof CollideCheckSectorIndex];

export type CollideSectorsMap = { rowsSplits:[number, number, number]; colSplits:[number, number, number] }

export const defineCollideSector = (cPos:CPosition, map:CollideSectorsMap):CollideCheckSectorIndex => {

	let rowIndexABC = 1;
	let colIndex123 = 1;

	for(const rowSplit of map.rowsSplits) {
		if(cPos.posY < rowSplit) {
			break;
		}
		rowIndexABC++;
	}

	for(const colSplit of map.colSplits) {
		if(cPos.posX < colSplit) {
			break;
		}
		colIndex123++;
	}

	return (rowIndexABC - 1) * map.colSplits.length + colIndex123 as CollideCheckSectorIndex;
};

export const SoundAction = {
	IDLE:    0,
	START:   1,
	PLAYING: 2,
	STOP:    -1
} as const;

export type SoundAction = typeof SoundAction[keyof typeof SoundAction];

export type CollidedWithEntity = number;
