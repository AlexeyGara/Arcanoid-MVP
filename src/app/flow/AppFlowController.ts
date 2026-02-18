/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: AppFlowController.ts
 * Path: src/app/flow/
 * Author: alexeygara
 * Last modified: 2026-02-18 17:24
 */

import type { AppContext }  from "@app-api/app-types";
import type { MusicPlayer } from "@core-api/audio-types";
import type {
	IEventBus,
	IEventEmitter,
	IEventImmediatelyEmitter
}                           from "@core-api/event-types";
import type {
	IStateMachine,
	IStatesFactory,
	TransitionWithLinkedFromStateField
}                           from "@core-api/fsm-types";
import type {
	IGameRestoreService,
	IUserProgressLoader
}                           from "@core-api/service-types";
import type {
	AppEvent,
	AppEventId
}                           from "app/event/events";
import { appFsmEventsMap }  from "app/event/events";
import { appTransitions }   from "app/flow/app-transitions";
import { AppSTATEid }       from "app/state/states";
import { FlowController }   from "core/flow/FlowController";
import { MusicRotator }     from "core/systems/audio/MusicRotator";

//@injectable()
export class AppFlowController extends FlowController<AppSTATEid, AppEvent, AppContext> {

	protected override get eventEmitter():IEventEmitter<AppEvent> & IEventImmediatelyEmitter<AppEvent> {
		return this._appEventBus;
	}

	private readonly _appEventBus:IEventBus<AppEvent>;
	private readonly _appContext:AppContext;
	private readonly _userService:IUserProgressLoader;
	private readonly _gameRestoreService:IGameRestoreService;
	private readonly _musicRotator:MusicRotator<AppSTATEid> = new MusicRotator();
	private _onMusicEnded?:(payload:AppEvent['APP.MUSIC.ENDED']) => void;
	private _onMusicStopped?:(payload?:AppEvent['APP.MUSIC.STOPPED']) => void;
	private _lastGameLevelId?:string;

	constructor(
		//@inject(TYPES.IEventBus) @named(Names.app_level)
		eventBus:IEventBus<AppEvent>,
		//@inject(TYPES.IStateMachine) @named(Names.app_level)
		stateMachine:IStateMachine<AppSTATEid, AppEvent, AppContext>,
		//@inject(TYPES.IStatesFactory) @named(Names.app_level)
		statesFactory:IStatesFactory<AppSTATEid, AppEvent>,
		userService:IUserProgressLoader,
		gameRestoreService:IGameRestoreService,
		appContext:AppContext
	) {
		super(eventBus,
			  stateMachine,
			  statesFactory);
		this._appEventBus        = eventBus;
		this._userService        = userService;
		this._gameRestoreService = gameRestoreService;
		this._appContext         = appContext;

		logger.log(String(!!this._appContext));
	}

	protected override async beforeStart():Promise<void> {

		//TODO: implement user data loading & last game restoring

		const [userDataDTO, lastGameRestoreKey] = await this._userService.loadUserProgress();

		logger.log(userDataDTO);

		if(lastGameRestoreKey) {
			const lastGameDTO = await this._gameRestoreService.restoreGameProcess(lastGameRestoreKey);

			logger.log(lastGameDTO);

			this._lastGameLevelId = "";
		}

	}

	protected getInitialStateId():[stateId:AppSTATEid, payload?:AppEvent[keyof AppEvent]] {

		if(this._lastGameLevelId) {
			return [AppSTATEid.LOADING_GAME, { levelId: this._lastGameLevelId }];
		}

		return [AppSTATEid.MAIN_MENU, void 0];
	}

	protected onStart():void {
		//TODO: implement
	}

	protected onStop():void {
		//TODO: implement
	}

	protected registerStatesAndTransitions<K extends AppSTATEid>(
		doRegister:(
			stateId:K,
			transitions:Readonly<TransitionWithLinkedFromStateField<K, AppSTATEid, AppEvent, AppContext>[]>
		) => void
	):void {
		for(const appStateName in appTransitions) {
			const appStateId          = appStateName as AppSTATEid;
			const appStateTransitions = appTransitions[appStateId];

			for(const stateTransition of appStateTransitions) {
				const toStateId:AppSTATEid | undefined = stateTransition.toStateId;

				switch(toStateId) {
					case AppSTATEid.MAIN_MENU:
						stateTransition.action = (context:AppContext):void => {
							this._stopMusic(context.audio.musicPlayer);
						};
						break;

					case AppSTATEid.LOADING_GAME:
						stateTransition.canInterrupt = true;
						stateTransition.action       = (context:AppContext):void => {
							this._startMusicFor(toStateId, context.audio.musicPlayer, true);
						};
						break;

					case AppSTATEid.GAME_MODE:
						stateTransition.canInterrupt = false;
						//stateTransition.guard = (context:AppContext) => true;
						stateTransition.action       = (context:AppContext):void => {
							this._startMusicFor(toStateId, context.audio.musicPlayer, true);
						};
						break;

					case AppSTATEid.WIN_SCREEN:
						stateTransition.canInterrupt = false;
						//stateTransition.guard = (context:AppContext) => true;
						stateTransition.action       = (context:AppContext):void => {
							this._startMusicFor(toStateId, context.audio.musicPlayer);
						};
						break;

					case AppSTATEid.LOSE_MODE:
						stateTransition.canInterrupt = true;
						//stateTransition.guard = (context:AppContext) => true;
						stateTransition.action       = (context:AppContext):void => {
							this._stopMusic(context.audio.musicPlayer);
						};
						break;

					case AppSTATEid.PAUSE_MODE:
						stateTransition.action = (context:AppContext):void => {
							context.audio.musicPlayer.pause();
						};
						break;

					case AppSTATEid.SETTINGS:
						break;

					case undefined:/* close active overlay state */
						break;

					default:
						assertNever(toStateId);
				}
			}

			doRegister(
				appStateId as K,
				appStateTransitions as Readonly<TransitionWithLinkedFromStateField<K, AppSTATEid, AppEvent, AppContext>[]>
			);
		}
	}

	protected registerEvents(addHandler:(event:keyof AppEvent) => EventHandlerDisposer):Array<() => void> {
		const disposers:EventHandlerDisposer[] = [];

		// register events at state-machine
		for(const appEventName in appFsmEventsMap) {
			const appEventId = appEventName as AppEventId;
			if(appFsmEventsMap[appEventId]) {
				disposers.push(addHandler(appEventId));
			}
		}

		// handle that events at current flow controller
		disposers.push(
			this.eventDispatcher.on('APP.FATAL_ERROR', error => {
				//TODO: Implement fatal-error popup flow
				logger.error(String(error));
			}),
			this.eventDispatcher.on('APP.TRANSITION_BLOCKED', transitionData => {
				//TODO: Implement transition blocked flow
				logger.warn(
					`Transition from state '${transitionData.from}' to state '${transitionData.to}' by event '${transitionData.event}' is blocked!`);
			})
		);

		return disposers;
	}

	private _startMusicFor(stateId:AppSTATEid, musicPlayer:MusicPlayer, autoStartNext:boolean = false):void {
		this._unsubscribeMusicEvents();

		const next = this._musicRotator.rotate(stateId);
		if(!next) {
			void musicPlayer.stop();
			return;
		}

		musicPlayer.start(next).then((playStarted:boolean) => {
			if(playStarted) {
				this._subscribeMusicEvents(stateId, musicPlayer, autoStartNext);
			}
		}).catch((reason) => {
			logger.warn(`Cannot start music for state '${stateId}' by reason: ${reason}.`);
		});
	}

	private _stopMusic(musicPlayer:MusicPlayer):void {
		this._unsubscribeMusicEvents();

		void musicPlayer.stop();
	}

	private _subscribeMusicEvents(stateId:AppSTATEid, musicPlayer:MusicPlayer, autoStartNext:boolean):void {
		this.eventDispatcher.once("APP.MUSIC.ENDED", this._onMusicEnded = (payload):void => {
			if(autoStartNext && payload.completed) {
				this._startMusicFor(stateId, musicPlayer, autoStartNext);
			}
		});

		this.eventDispatcher.once('APP.MUSIC.STOPPED', this._onMusicStopped = ():void => {
			this._unsubscribeMusicEvents();
		});
	}

	private _unsubscribeMusicEvents():void {
		if(this._onMusicEnded) {
			this.eventDispatcher.off('APP.MUSIC.ENDED', this._onMusicEnded);
			delete this._onMusicEnded;
		}

		if(this._onMusicStopped) {
			this.eventDispatcher.off('APP.MUSIC.STOPPED', this._onMusicStopped);
			delete this._onMusicStopped;
		}
	}

	protected emitFatalError(error:Error):void {
		void this.eventEmitter.emitImmediately('APP.FATAL_ERROR', error);
	}

	protected onTransitionCompleted?(event:keyof AppEvent):void;

	protected onTransitionInterrupted(interruptByEvent:keyof AppEvent,
									  fromState:AppSTATEid | undefined,
									  toState:AppSTATEid | undefined,
									  byState:AppSTATEid | undefined):void {

		logger.warn(
			`Previous app-transition from '${fromState}' to '${toState}' was interrupted by '${byState}' when handle event '${String(
				interruptByEvent)}'!`);
	}

	protected onTransitionBlocked(blockedEvent:keyof AppEvent,
								  fromState:AppSTATEid | undefined,
								  toState:AppSTATEid | undefined):void {

		void this.eventEmitter.emit('APP.TRANSITION_BLOCKED', {
			from:  fromState,
			to:    toState,
			event: blockedEvent
		});
	}

}