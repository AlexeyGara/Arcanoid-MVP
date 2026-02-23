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
		return Promise.resolve(undefined);
	}

	storeGameProcess(gameDataJson:GameProcessDTO):Promise<StoredGameProcessKey> {
		return Promise.resolve(undefined);
	}

}