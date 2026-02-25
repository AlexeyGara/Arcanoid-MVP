/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: CAnimation.ts
 * Path: src/game/logic/ecs/animation/
 * Author: alexeygara
 * Last modified: 2026-02-25 21:11
 */

import type { IAnimation } from "@core-api/animation-types";

export class CAnimation {

	animationsIds:Set<string> = new Set();
	animations:Set<IAnimation> = new Set();

	constructor() {
	}
}