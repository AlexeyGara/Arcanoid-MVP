/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: index.ts
 * Path: src/game/logic/ecs/
 * Author: alexeygara
 * Last modified: 2026-02-25 15:56
 */

export const TEMP_POINT_1:Point<number> = { x: 0, y: 0 };
export const TEMP_POINT_2:Point<number> = { x: 0, y: 0 };
export const TEMP_POINT_3:Point<number> = { x: 0, y: 0 };
export const TEMP_POINT_4:Point<number> = { x: 0, y: 0 };
export const TEMP_POINT_OUT:Point<number> = { x: 0, y: 0 };

/**
 * Get intersection
 * @param A1 Previous point on trajectory.
 * @param A2 Last point of trajectory.
 * @param B Point of block edge.
 * @param C Another point of block edge.
 * @param out
 */
export const getIntersection = (A1:Point<number>, A2:Point<number>,
								B:Point<number>, C:Point<number>,
								out?:Point<number>):Readonly<Point<number>> | null => {
	const dx1 = A2.x - A1.x;
	const dy1 = A2.y - A1.y;
	const dx2 = C.x - B.x;
	const dy2 = C.y - B.y;

	const det = dx1 * dy2 - dy1 * dx2;

	// If determinate is 0, so lines are parallel
	if(Math.abs(det) < 1e-10) {
		return null;
	}

	const t = ((B.x - A1.x) * dy2 - (B.y - A1.y) * dx2) / det;
	const u = ((B.x - A1.x) * dy1 - (B.y - A1.y) * dx1) / det;

	if(t >= 0 && t <= 1 && u >= 0 && u <= 1) {

		if(out) {
			out.x = A1.x + t * dx1;
			out.y = A1.y + t * dy1;
			return out;
		}

		return {
			x: A1.x + t * dx1,
			y: A1.y + t * dy1
		};
	}

	return null;
};
