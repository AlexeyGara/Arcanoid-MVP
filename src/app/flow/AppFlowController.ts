/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: AppFlowController.ts
 * Path: src/app/flow/
 * Author: alexeygara
 * Last modified: 2026-02-18 17:24
 */

import type { AppContext } from "@app-api/app-types";
import type { IEventBus }  from "@core-api/event-types";
import type {
	IStateMachine,
	IStatesFactory,
	TransitionWithLinkedFromStateField
} from "@core-api/fsm-types";
import type {
	IGameRestoreService,
	IUserProgressLoader
}                          from "@core-api/service-types";
import type { AppEvent }   from "app/event/events";
import { AppSTATEid }      from "app/state/states";
import { FlowController }  from "core/flow/FlowController";
import { MusicRotator }    from "core/systems/audio/MusicRotator";

//@injectable()
export class AppFlowController extends FlowController<AppSTATEid, AppEvent, AppContext> {

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
		this._userService = userService;
		this._gameRestoreService = gameRestoreService;
		this._appContext = appContext;
	}

	protected override async beforeStart():Promise<void> {

		//TODO: implement user data loading & last game restoring

		const [userDataDTO, lastGameRestoreKey] = await this._userService.loadUserProgress();

		if(lastGameRestoreKey) {
			const lastGameDTO = await this._gameRestoreService.restoreGameProcess(lastGameRestoreKey);

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

	protected registerStatesAndTransitions<K extends AppSTATEid>(
		doRegister:(
			stateId:K,
			transitions:Readonly<TransitionWithLinkedFromStateField<K, AppSTATEid, AppEvent, AppContext>[]>
		) => void
	):void {
		for(const appStateName in appTransitions) {
			const appStateId = appStateName as AppSTATEid;
			const appStateTransitions = appTransitions[appStateId];

			for(const stateTransition of appStateTransitions) {
				switch(stateTransition.toStateId) {
					case AppSTATEsIDs.MAIN_MENU:
						stateTransition.action = (context:AppContext) => {
							this.stopMusic(context.musicPlayer);
						};
						break;
					case AppSTATEsIDs.BONUS_ROOM:
						stateTransition.action = (context:AppContext) => {
							this.stopMusic(context.musicPlayer);
						};
						break;
					case AppSTATEsIDs.LOADING_MAP:
						stateTransition.canInterrupt = false;
						stateTransition.action = (context:AppContext) => {
							this.startMusicFor(AppSTATEsIDs.LOADING_MAP, context.musicPlayer, true);
						};
						break;
					case AppSTATEsIDs.LOADING_GAME:
						stateTransition.canInterrupt = false;
						//stateTransition.guard = (context:AppContext) => true;
						stateTransition.action = (context:AppContext) => {
							this.startMusicFor(AppSTATEsIDs.LOADING_GAME, context.musicPlayer, true);
						};
						break;
					case AppSTATEsIDs.LOADING_TRAINING:
						stateTransition.canInterrupt = false;//true;
						//stateTransition.guard = (context:AppContext) => true;
						stateTransition.action = (context:AppContext) => {
							this.startMusicFor(AppSTATEsIDs.LOADING_TRAINING, context.musicPlayer, true);
						};
						break;
					case AppSTATEsIDs.MAP_SCREEN:
						stateTransition.action = (context:AppContext) => {
							this.startMusicFor(AppSTATEsIDs.MAP_SCREEN, context.musicPlayer, true);
						};
						break;
					case AppSTATEsIDs.GAME_MODE:
						stateTransition.action = (context:AppContext) => {
							this.startMusicFor(AppSTATEsIDs.GAME_MODE, context.musicPlayer, true);
						};
						break;
					case AppSTATEsIDs.TRAINING_MODE:
						stateTransition.action = (context:AppContext) => {
							this.startMusicFor(AppSTATEsIDs.TRAINING_MODE, context.musicPlayer, true);
						};
						break;
					case AppSTATEsIDs.WIN_SCREEN:
						stateTransition.action = (context:AppContext) => {
							this.startMusicFor(AppSTATEsIDs.WIN_SCREEN, context.musicPlayer);
						};
						break;
					default:
						assertNever(stateTransition.toStateId);
				}
			}

			doRegister(
				appStateId as K,
				appStateTransitions as Readonly<TransitionWithLinkedFromStateField<K, AppSTATEid, AppEvent, AppContext>[]>
			);
		}
	}

}