/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: WorldFlowContext.ts
 * Path: src/game/logic/ecs/
 * Author: alexeygara
 * Last modified: 2026-02-26 00:37
 */

import type {
	AnimationStarter,
	IAnimationPlayer
}                                 from "@core-api/animation-types";
import type { SoundStarter }      from "@core-api/audio-types";
import type {
	KeyInputData,
	TouchInputData
}                                 from "@core-api/input-types";
import type { CollideSectorsMap } from "game/logic/ecs/index";

export type WorldFlowContext = {

	input:{
		keys:{
			leftKey:KeyInputData;
			rightKey:KeyInputData;
		};
		touches:{
			leftTouch:TouchInputData;
			rightTouch:TouchInputData;
		};
	};

	gamefield:{
		collideSectors:CollideSectorsMap;
	};

	systems:{
		animation:{
			starter:AnimationStarter;
			player:IAnimationPlayer;
		};
		sound:SoundStarter;
	};
}