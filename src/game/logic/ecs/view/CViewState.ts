/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: CPosition.ts
 * Path: src/game/logic/ecs/position/
 * Author: alexeygara
 * Last modified: 2026-02-25 15:39
 */

import { ViewState } from "game/logic/ecs";

export class CViewState {

	state:ViewState;
	stateDurationMs:number = 0;
	alignStateCallback:(mode:ViewState) => void;

	constructor(
		updateState:(mode:ViewState) => void,
		state:ViewState = ViewState.NORMAL
	) {
		this.alignStateCallback = updateState;
		this.state              = state;
	}
}