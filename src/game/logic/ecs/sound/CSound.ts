/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: CSound.ts
 * Path: src/game/logic/ecs/sound/
 * Author: alexeygara
 * Last modified: 2026-02-25 13:15
 */

import type { AudioAssetID } from "@core-api/audio-types";
import { SoundAction }       from "game/logic/ecs";

export class CSound {

	status:SoundAction = SoundAction.IDLE;
	readonly soundId:AudioAssetID;

	constructor(
		soundAlias:AudioAssetID
	) {
		this.soundId = soundAlias;
	}
}