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
	KeyCode,
	KeyInputManager,
	TouchInputManager,
	TouchType
}                              from "@core-api/input-types";
import type { IResizeManager } from "@core-api/service-types";
import type {
	IPauseManager,
	SystemsProvider
}                              from "@core-api/system-types";

export type AppContext<TKeyCode extends KeyCode,
	TTouchType extends TouchType,
	TInputEventEmitterType>
	= Readonly<{

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
				emittersProvider:(emitterId:TSceneChildrenId) => TInputEventEmitterType,
				pauseManager?:IPauseManager
			) => [
				KeyInputManager<TKeyCode, TSceneChildrenId>, () => void
			];
		};
		touchInput:{
			readonly provide:<TSceneChildrenId extends SceneChildIdBase>(
				setName:string,
				emittersProvider:(emitterId:TSceneChildrenId) => TInputEventEmitterType,
				pauseManager?:IPauseManager
			) => [
				TouchInputManager<TTouchType, TSceneChildrenId>, () => void
			];
		};
		actions:SystemsProvider['actionsManager'];
		animations:SystemsProvider['animationsManager'];
		sounds:SystemsProvider['soundsManager'];
		music:SystemsProvider['musicManager'];
	};

	services:{
		resize:Pick<IResizeManager, 'addListener' | 'removeListener'>;
	};

}>;