/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: Bootstrap.ts
 * Path: src/
 * Author: alexeygara
 * Last modified: 2026-02-16 19:48
 */

import type { AppContext }   from "@app-api/app-types";
import type {
	IAudioPlayer,
	VoiceUpdatable
}                            from "@core-api/audio-types";
import type {
	FocusInOutForwarder,
	ResizeEventForwarder,
	ViewSizeProvider
}                            from "@core-api/service-types";
import type {
	IPauseManager,
	SystemsProvider
}                            from "@core-api/system-types";
import { AppFlowController } from "app/flow/AppFlowController";
import { AppStateMachine }   from "app/flow/AppStateMachine";
import {
	isAppSystem,
	isDestroyable,
	isGameLoopActor
}                            from "core/core-utils";
import { EventBus }          from "core/event/EventBus";
import { GameLoop }          from "core/gameloop/GameLoop";
import { ResizeManager }     from "core/services/ResizeManager";
import { ActionManager }     from "core/systems/action/ActionManager";
import { AnimationManager }  from "core/systems/animation/AnimationManager";
import { AudioVoice }        from "core/systems/audio/AudioVoice";
import { MusicManager }      from "core/systems/audio/MusicManager";
import { SoundsManager }     from "core/systems/audio/SoundsManager";
import { PauseManager }      from "core/systems/PauseManager";
import { Platform }          from "./Platform";

export class Bootstrap {

	private readonly _originAssetsSize:Size<uintMoreZero>;
	private readonly _appViewContainer:HTMLDivElement;
	private readonly _onFocusInOutForwarder:FocusInOutForwarder;
	private readonly _onResizeForwarder:ResizeEventForwarder;
	private readonly _viewSizeProvider:ViewSizeProvider;

	constructor(
		originAssetsSize:Size<uintMoreZero>,
		appViewContainer:HTMLDivElement,
		onFocusInOutForwarder:FocusInOutForwarder,
		onResizeForwarder:ResizeEventForwarder,
		viewSizeProvider:ViewSizeProvider
	) {
		this._originAssetsSize      = originAssetsSize;
		this._appViewContainer      = appViewContainer;
		this._onFocusInOutForwarder = onFocusInOutForwarder;
		this._onResizeForwarder     = onResizeForwarder;
		this._viewSizeProvider      = viewSizeProvider;
	}

	async start():Promise<void> {

		//TODO: use di-container instead

		// instancing
		const rootPauseManager
				  = new PauseManager(`GLOBAL: Pause manager`);
		const resizeManager
				  = new ResizeManager(this._originAssetsSize,
									  this._viewSizeProvider,
									  this._onResizeForwarder);
		const gameLoop
				  = new GameLoop();
		const appEventBus
				  = new EventBus();
		const globalAudioVoice
				  = new AudioVoice('GLOBAL: Audio Voice');
		const globalMusicVolumeControl
				  = new AudioVoice('GLOBAL: Music Volume', globalAudioVoice);
		const globalSoundsVolumeControl
				  = new AudioVoice('GLOBAL: Sounds Volume', globalAudioVoice);
		const audioPlayerProvider
				  = Platform.provideAudioPlayer;
		const globalMusicManager
				  = new MusicManager('GLOBAL: Music Manager', globalMusicVolumeControl,
									 audioPlayerProvider(),
									 (musicAlias, completed) => {
										 void appEventBus.emit('APP.MUSIC.ENDED',
															   { musicAlias, completed });
									 },
									 () => {
										 void appEventBus.emit('APP.MUSIC.STOPPED', void 0);
									 });

		// application context
		const appContext:AppContext = {

			audio: {
				globalAudioVoice: globalAudioVoice,
				musicVoice:       globalMusicVolumeControl,
				soundsVoice:      globalSoundsVolumeControl,
				musicPlayer:      globalMusicManager
			},

			systems: {
				pause:
					   this._providePauseManager(rootPauseManager),

				keyInput:,

				touchInput:,

				actions:
					   this._provideActionSystem(gameLoop, rootPauseManager,
												 this._commonReleaseMethod(gameLoop)),
				animations:
					   this._provideAnimationSystem(gameLoop, rootPauseManager,
													this._commonReleaseMethod(gameLoop)),
				sounds:
					   this._provideSoundSystem(gameLoop, rootPauseManager, globalSoundsVolumeControl,
												audioPlayerProvider, this._commonReleaseMethod(gameLoop)),
				music: {
					provide: () => [globalMusicManager, globalMusicVolumeControl],
				}
			},

			services: {
				resize: resizeManager
			}
		};

		// systems activation
		rootPauseManager.addSystem(gameLoop);

		// init environment events handlers
		this._onFocusInOutForwarder(rootPauseManager.resume, rootPauseManager.pause);

		// start application
		const renderMethod = await Platform.getRenderMethod(this._appViewContainer);
		gameLoop.init(renderMethod);
		gameLoop.start(Platform.getFrameRequester());

		// start main flow
		const appFlowControl = new AppFlowController(appEventBus,
													 new AppStateMachine(appContext),
													 null,
													 null,
													 null,
													 appContext);
		await appFlowControl.start();
	}

	private _providePauseManager = (rootPauseManager:IPauseManager):SystemsProvider['pauseManager'] => ({
		provide(setName:string,
				masterPauseManager?:IPauseManager
		):ReturnType<SystemsProvider['pauseManager']['provide']> {
			const manager = new PauseManager(setName, masterPauseManager || rootPauseManager);

			return [manager, ():void => {
				if(manager != rootPauseManager && isDestroyable(manager)) {
					manager.destroy();
				}
			}];
		}
	});

	private _provideActionSystem = (gameLoop:GameLoop, rootPauseManager:IPauseManager,
									releaseMethod:(instance:object,
												   pauseManager:IPauseManager) => void
	):SystemsProvider['actionsManager'] => ({
		provide(setName:string,
				pauseManager?:IPauseManager
		):ReturnType<SystemsProvider['actionsManager']['provide']> {
			pauseManager ||= rootPauseManager;
			const actions = new ActionManager(setName);
			// logic phase: add
			gameLoop.add(actions);
			pauseManager?.addSystem(actions);

			return [actions, ():void => {
				actions.cancelAll();
				releaseMethod(actions, pauseManager!);
			}];
		}
	});

	private _provideAnimationSystem = (gameLoop:GameLoop, rootPauseManager:IPauseManager,
									   releaseMethod:(instance:object,
													  pauseManager:IPauseManager) => void
	):SystemsProvider['animationsManager'] => ({
		provide(setName:string,
				pauseManager?:IPauseManager
		):ReturnType<SystemsProvider['animationsManager']['provide']> {
			pauseManager ||= rootPauseManager;
			const animations = new AnimationManager(setName);
			// animation phase: add
			gameLoop.add(animations);
			pauseManager?.addSystem(animations);

			return [animations, ():void => {
				animations.cancelAll();
				releaseMethod(animations, pauseManager!);
			}];
		}
	});

	private _provideSoundSystem = (gameLoop:GameLoop, rootPauseManager:IPauseManager,
								   globalSoundsControl:VoiceUpdatable, audioPlayerProvider:() => IAudioPlayer,
								   releaseMethod:(instance:object,
												  pauseManager:IPauseManager) => void
	):SystemsProvider['soundsManager'] => ({
		provide(setName:string,
				pauseManager?:IPauseManager
		):ReturnType<SystemsProvider['soundsManager']['provide']> {
			pauseManager ||= rootPauseManager;
			const voice  = new AudioVoice(setName, globalSoundsControl);
			const sounds = new SoundsManager(setName, voice, audioPlayerProvider);
			// audio phase: add
			gameLoop.add(sounds);
			pauseManager.addSystem(sounds);

			return [[sounds, voice], ():void => {
				sounds.stopAll();
				releaseMethod(sounds, pauseManager!);
			}];
		}
	});

	private _commonReleaseMethod = (gameLoop:GameLoop) => (instance:object, pauseManager:IPauseManager):void => {
		if(isGameLoopActor(instance)) {
			gameLoop.remove(instance);
		}
		if(isAppSystem(instance)) {
			pauseManager.removeSystem(instance);
		}
		if(isDestroyable(instance)) {
			instance.destroy();
		}
	};

}