/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: AppUserService.ts
 * Path: src/app/services/
 * Author: alexeygara
 * Last modified: 2026-02-23 16:38
 */

import type {
	IUserProgressLoader,
	IUserProgressSaver,
	StoredGameProcessKey,
	UserProfileDTO,
	UserProgressData
} from "@core-api/service-types";

export class AppUserService

	implements IUserProgressSaver,
			   IUserProgressLoader {

	loadUserProgress():Promise<UserProgressData> {
		return Promise.resolve(undefined);
	}

	saveUserProgress(userProfileJson:UserProfileDTO, storedGameProcessKey:StoredGameProcessKey):Promise<void> {
		return Promise.resolve(undefined);
	}

}