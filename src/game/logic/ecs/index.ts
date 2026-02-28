/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: index.ts
 * Path: src/game/logic/ecs/
 * Author: alexeygara
 * Last modified: 2026-02-25 15:56
 */

import type { CVelocity } from "game/logic/ecs/movement/CVelocity";
import type { CPosition } from "game/logic/ecs/position/CPosition";

export const DELTA_TIME_MULTIPLIER = 1;

export const MAX_ENTITIES_AT_WORLD = 1000;

export const CONTROLLED_VELOCITY_X_MAX = 3;

export const BALL_VELOCITY_MAX   = { x: 4.5, y: 3.5 } as const;
export const BALL_VELOCITY_Y_MIN = 0.15;
export const BALL_SPEED          = Math.hypot(3 * 3);

export const BOARD_VELOCITY_X_TO_BALL_MULTIPLIER = 0.8;

export const DEFAULT_BALL_RADIUS         = 10;
export const DEFAULT_BLOCK_HEALTH        = 1;
/** Critical block's health when block is immediately collapsed during collide with ball.
 * And ball will not be reflected! */
export const BLOCK_CRITICAL_HEALTH       = DEFAULT_BLOCK_HEALTH / 10;
export const DEFAULT_BLOCK_HEALTH_DAMAGE = 0.5;

export const BALL_RADIUS = 6;

export const BOARD_COLLIDE_ACTIVE_STATE_DURATION_MS = 100;
export const BALL_COLLIDE_ACTIVE_STATE_DURATION_MS  = 85;
export const BLOCK_COLLIDE_ACTIVE_STATE_DURATION_MS  = 125;

export const CollideCheckSectorIndex = {
	NOT_SET: 0,

	A1: 1, A2: 2, A3: 3,
	B1: 4, B2: 5, B3: 6,
	C1: 7, C2: 8, C3: 9,
} as const;

export type CollideCheckSectorIndex = typeof CollideCheckSectorIndex[keyof typeof CollideCheckSectorIndex];

export type CollideSectorsMap = { rowsSplits:[number, number, number]; colSplits:[number, number, number] }

export const defineCollideSector = (cPos:CPosition, map:CollideSectorsMap):CollideCheckSectorIndex => {

	let rowIndexABC = 0;
	let colIndex123 = 0;

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

export const ViewState = {
	NORMAL:  0,
	ACTIVE:  1,
	DESTROY: 2
};

export type ViewState = typeof ViewState[keyof typeof ViewState];

export const stableBallVelocityY = (cBallVelocity:CVelocity):void => {

	cBallVelocity.velX = cBallVelocity.velX > 0
						 ? Math.min(BALL_VELOCITY_MAX.x, cBallVelocity.velX)
						 : Math.max(-BALL_VELOCITY_MAX.x, cBallVelocity.velX);

	let velYMod        = Math.sqrt(Math.max(0, BALL_SPEED ** 2 - Math.abs(cBallVelocity.velX) ** 2));
	velYMod            = Math.max(BALL_VELOCITY_Y_MIN, velYMod);
	cBallVelocity.velY = cBallVelocity.velY > 0
						 ? Math.min(BALL_VELOCITY_MAX.y, velYMod)
						 : Math.max(-BALL_VELOCITY_MAX.y, -velYMod);

};
