/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: CPosition.ts
 * Path: src/game/logic/ecs/position/
 * Author: alexeygara
 * Last modified: 2026-02-25 15:39
 */

import type {
	Query,
	System,
	World
}                     from "@releaseband/ecs";
import { ViewState }  from "game/logic/ecs";
import { CPosition }  from "game/logic/ecs/position/CPosition";
import { CView }      from "./CView";
import { CViewState } from "./CViewState";

export class SViewUpdate

	implements System {

	private readonly _world:World;
	private readonly _query:Query;
	private readonly _queryState:Query;

	constructor(
		world:World
	) {
		this._world      = world;
		this._query      = world.createQuery([CView, CPosition]);
		this._queryState = world.createQuery([CViewState]);
	}

	update(deltaTime:number):void {

		for(const entity of this._query.entities) {
			const cView = this._world.getComponent(entity, CView);
			const cPos  = this._world.getComponent(entity, CPosition);

			cView.alignPosCallback(cPos);
		}

		for(const entity of this._queryState.entities) {
			const cViewSt = this._world.getComponent(entity, CViewState);

			if(cViewSt.stateDurationMs < 0) {
				cViewSt.alignStateCallback(cViewSt.state);
			}
			else if(cViewSt.stateDurationMs === 0) {
				const update  = cViewSt.state != ViewState.NORMAL;
				cViewSt.state = ViewState.NORMAL;
				if(update) {
					cViewSt.alignStateCallback(cViewSt.state);
				}
			}
			else {
				cViewSt.alignStateCallback(cViewSt.state);
				cViewSt.stateDurationMs = Math.max(0, cViewSt.stateDurationMs - deltaTime);
			}
		}
	}

	exit():void {

		this._world.removeQuery(this._query);
		this._world.removeQuery(this._queryState);
	}

}