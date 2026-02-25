/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: CInputControlled.ts
 * Path: src/game/logic/ecs/input/
 * Author: alexeygara
 * Last modified: 2026-02-25 14:44
 */

type KeyIsDown = boolean;
type KeyPressedCount = number;
type TouchIsDown = boolean;
type TouchPressedCount = number;

export class CInputControlled {

	movingLeft:[KeyIsDown, TouchIsDown]                          = [false, false];
	movingRight:[KeyIsDown, TouchIsDown]                         = [false, false];
	lastMoveLeftDurationMs:[KeyPressedCount, TouchPressedCount]  = [0, 0];
	lastMoveRightDurationMs:[KeyPressedCount, TouchPressedCount] = [0, 0];

	constructor() {
	}
}