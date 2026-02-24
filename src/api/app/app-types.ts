/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: app-types.ts
 * Path: src/api/app/
 * Author: alexeygara
 * Last modified: 2026-02-17 16:42
 */

import type {
	IVolumeManager,
	MusicPlayer
}                              from "@core-api/audio-types";
import type {
	KeyInputManager,
	TouchInputManager
}                              from "@core-api/input-types";
import type { IScenesManager } from "@core-api/scene-types";
import type { IResizeManager } from "@core-api/service-types";
import type {
	IPauseManager,
	SystemsProvider
}                              from "@core-api/system-types";
import type { AppSceneID }     from "app/scene/scenes";
import type { AppGameService } from "services/AppGameService";
import type { AppUserService } from "services/AppUserService";

export type AppContext = Readonly<{

	scenes:{
		sceneManager:{
			readonly provide:() => IScenesManager<AppSceneID>;
		};
	};

	audio:{
		globalAudioVoice:IVolumeManager;
		musicVoice:IVolumeManager;
		musicPlayer:MusicPlayer;
		soundsVoice:IVolumeManager;
	};

	systems:{
		pause:SystemsProvider['pauseManager'];
		keyInput:{
			readonly provide:<TSceneChildrenId extends SceneChildIdBase>(
				setName:string,
				pauseManager?:IPauseManager
			) => [
				KeyInputManager<TSceneChildrenId>, () => void
			];
		};
		touchInput:{
			readonly provide:<TSceneChildrenId extends SceneChildIdBase>(
				setName:string,
				pauseManager?:IPauseManager
			) => [
				TouchInputManager<TSceneChildrenId>, () => void
			];
		};
		actions:SystemsProvider['actionsManager'];
		animations:SystemsProvider['animationsManager'];
		sounds:SystemsProvider['soundsManager'];
		music:SystemsProvider['musicManager'];
	};

	services:{
		resize:Pick<IResizeManager, 'addListener' | 'removeListener'>;
		user:AppUserService;
		game:AppGameService;
	};

}>;