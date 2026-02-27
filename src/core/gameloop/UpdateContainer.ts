/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: UpdateContainer.ts
 * Path: src/core/gameloop/
 * Author: alexeygara
 * Last modified: 2026-02-27 23:59
 */

import type {
	GameTime,
	IGameLoopUpdatable
}                             from "@core-api/gameloop-types";
import type { GameLoopPhase } from "core/gameloop/GameLoopPhase";

export class UpdateContainer<TUpdatePhase extends GameLoopPhase>

	implements IGameLoopUpdatable {

	readonly updatePhase:TUpdatePhase;

	private readonly _updatables:Set<IGameLoopUpdatable<TUpdatePhase>>;

	constructor(
		phase:TUpdatePhase,
		...updatables:IGameLoopUpdatable<TUpdatePhase>[]
	) {
		this.updatePhase = phase;
		this._updatables = new Set(updatables);
	}

	has(updatable:IGameLoopUpdatable<TUpdatePhase>):boolean {
		return this._updatables.has(updatable);
	}

	add(updatable:IGameLoopUpdatable<TUpdatePhase>):boolean {
		if(this._updatables.has(updatable)) {
			return false;
		}

		this._updatables.add(updatable);

		return true;
	}

	remove(updatable:IGameLoopUpdatable<TUpdatePhase>):boolean {
		return this._updatables.delete(updatable);
	}

	update(time:GameTime):void {
		for(const updatable of this._updatables) {
			updatable.update(time);
		}
	}

}