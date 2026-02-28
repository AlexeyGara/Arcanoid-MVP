/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: CPosition.ts
 * Path: src/game/logic/ecs/position/
 * Author: alexeygara
 * Last modified: 2026-02-25 15:39
 */

import type { CPosition } from "game/logic/ecs/position/CPosition";

type updateCallbackArgs = Readonly<Pick<CPosition, 'posX' | 'posY'>>;

export class CView {

	alignPosCallback:(...args:updateCallbackArgs[]) => void;

	constructor(
		updateCallback:(pos:updateCallbackArgs) => void
	) {
		this.alignPosCallback = updateCallback;
	}
}