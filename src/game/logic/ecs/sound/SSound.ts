/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: SSound.ts
 * Path: src/game/logic/ecs/sound/
 * Author: alexeygara
 * Last modified: 2026-02-25 13:10
 */

import type { SoundStarter } from "@core-api/audio-types";
import type {
	Query,
	System,
	World
}                            from "@releaseband/ecs";
import { SoundAction }       from "game/logic/ecs";
import { CSound }            from "game/logic/ecs/sound/CSound";

export class SSound

	implements System {

	private readonly _soundStarter:SoundStarter;
	private readonly _world:World;
	private readonly _query:Query;

	constructor(
		world:World,
		soundStarter:SoundStarter
	) {
		this._soundStarter = soundStarter;
		this._world        = world;
		this._query        = world.createQuery([CSound]);
	}

	update(_:number):void {

		for(const entity of this._query.entities) {
			const cSound = this._world.getComponent(entity, CSound);

			switch(cSound.status) {

				case SoundAction.START:
					const [_, result] = this._soundStarter.playByAlias(cSound.soundId);
					result.catch((e) => {
						logger.warn(`Cannot star playback for '${cSound.soundId}' sound by reason: ${String(e)}`);
					}).finally(() => {
						if(cSound.status == SoundAction.PLAYING) {
							cSound.status = SoundAction.IDLE;
						}
					});
					cSound.status = SoundAction.PLAYING;
					break;

				case SoundAction.STOP:
					this._soundStarter.stopByAlias(cSound.soundId);
					cSound.status = SoundAction.IDLE;
					break;

				case SoundAction.PLAYING:
				case SoundAction.IDLE:
					break;

				default:
					assertNever(cSound.status);
			}
		}
	}

	exit():void {

		for(const entity of this._query.entities) {
			const cSound = this._world.getComponent(entity, CSound);

			if(cSound.status == SoundAction.PLAYING) {
				this._soundStarter.stopByAlias(cSound.soundId);
				cSound.status = SoundAction.IDLE;
			}
		}

		this._world.removeQuery(this._query);
	}

}