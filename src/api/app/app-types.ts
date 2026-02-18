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
}                               from "@core-api/audio-types";
import type { IResizeManager }  from "@core-api/service-types";
import type { SystemsProvider } from "@core-api/system-types";

export type AppContext = Readonly<{

	audio:{
		globalAudioVoice:IVolumeManager;
		musicVoice:IVolumeManager;
		musicPlayer:MusicPlayer;
		soundsVoice:IVolumeManager;
	};

	systems:{
		pause:SystemsProvider['pauseManager'];
		keyInput:SystemsProvider['keyInputManager'];
		touchInput:SystemsProvider['touchInputManager'];
		actions:SystemsProvider['actionsManager'];
		animations:SystemsProvider['animationsManager'];
		sounds:SystemsProvider['soundsManager'];
		music:SystemsProvider['musicManager'];
	};

	services:{
		resize:Pick<IResizeManager, 'addListener' | 'removeListener'>;
	};

}>;