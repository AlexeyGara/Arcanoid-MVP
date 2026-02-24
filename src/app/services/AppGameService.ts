/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: GameProgressService.ts
 * Path: src/app/services/
 * Author: alexeygara
 * Last modified: 2026-02-23 16:24
 */

import type {
	GameProcessDTO,
	IGameRestoreService,
	IGameStoreService,
	StoredGameProcessKey
} from "@core-api/service-types";

export class AppGameService

	implements IGameStoreService,
			   IGameRestoreService {

	restoreGameProcess(key:StoredGameProcessKey):Promise<GameProcessDTO> {
		//TODO: implement
		logger.log(key);
		return Promise.resolve("game-process-dto-json");
	}

	storeGameProcess(gameDataJson:GameProcessDTO):Promise<StoredGameProcessKey> {
		//TODO: implement
		logger.log(gameDataJson);
		return Promise.resolve("game-process-store-key");
	}

}