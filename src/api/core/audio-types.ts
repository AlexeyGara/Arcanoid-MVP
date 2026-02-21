/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: audio-types.ts
 * Path: src/api/core/
 * Author: alexeygara
 * Last modified: 2026-02-17 18:19
 */

import type { GameLoopPhase }      from "core/gameloop/GameLoopPhase";
import type { GameLoopPhaseActor } from "./gameloop-types";
import type { CanBePaused }        from "./system-types";

export type AudioAssetID = string;

export interface IAudioPlayer extends CanBePaused {

	/**
	 * Start a playback of sound with specified id and playing-options.
	 * @param audioAsset Sound id.
	 * @param options Playing options.
	 * @return A promise for wait a playing result: *__playback finished__*, *__canceled__* (see {@link OnFinishResult}).
	 * If cannot start a playback - '__*false*__' will be returned.
	 * <br/>**NOTE:** There is no a valid condition when this promise can be rejected.
	 */
	play(audioAsset:AudioAssetID, options?:AudioOptions):Promise<OnFinishResult> | false;

	stop(audioAsset:AudioAssetID):boolean;

	mute(audioAsset:AudioAssetID):void;

	unmute(audioAsset:AudioAssetID):void;

	setVolume(audioAsset:AudioAssetID, v:number):void;

	setLoop(audioAsset:AudioAssetID, loop:boolean):void;
}

export type AudioOptions = {
	readonly volume:number;
	readonly muted:boolean;
	readonly loop:boolean;
}

export interface ISound {
	readonly alias:AudioAssetID;
	readonly playing:boolean;
	readonly volume:number;
	readonly muted:boolean;
	readonly completed:boolean;
	readonly canceled:boolean;

	stop():void;
}

export type CanBePlayed = {

	readonly playedTimeMs:number;

	play(audioPlayer:IAudioPlayer, loop?:boolean):boolean;

	onCompletePlaying?:(soundAlias:AudioAssetID) => void;
}

export type CanBeMuted = {
	mute():void;

	unmute():void;
}

export type CanChangeVolume = {
	setVolume(v:number):void;
}

export type MasterVoiceControlled = {
	masterMute():void;

	masterUnmute():void;

	setMasterVolume(mv:number):void;
}

export type SoundStarter = {

	playByAlias(soundAlias:AudioAssetID, loop?:boolean):
		[ISound & CanBeMuted & CanChangeVolume, Promise<OnFinishResult>];
	playByAlias(soundAlias:AudioAssetID, loop?:boolean):
		[undefined, Promise<false>];

	play(sound:ISound & CanBePlayed & CanBePaused & MasterVoiceControlled, loop?:boolean):
		Promise<OnFinishResult | false>;

	stopByAlias(soundAlias:AudioAssetID):boolean;
}

export interface ISoundManager extends GameLoopPhaseActor<typeof GameLoopPhase.AUDIO>,
									   SoundStarter,
									   VoiceUpdateListener {

	stopAll():void;
}

export type SoundsPlayback = Readonly<[SoundStarter, IVolumeManager]>;

export type MusicTrack = {
	readonly alias:AudioAssetID;
	readonly loop:boolean;
	readonly volume:number;
	readonly fadeOptions:FadeOptions;
}

export type FadeOptions = {
	/** Fade-In time in seconds */
	readonly fadeInTimeSec?:number;
	/** Fade-Out time in seconds */
	readonly fadeOutTimeSec?:number;
}

export type MusicPlayer = {

	readonly activeTrack:MusicTrack | undefined;

	start(track:MusicTrack, options?:FadeOptions):Promise<boolean>;

	resume():void;

	pause():void;

	stop(immediatelyAndIgnoreFadeOutOption?:boolean, fadeOutTimeSec?:number):Promise<void>;
}

export interface IMusicManager extends GameLoopPhaseActor<typeof GameLoopPhase.AUDIO>,
									   MusicPlayer,
									   VoiceUpdateListener {

}

export type Voice = {
	readonly name:string;
	readonly volume:number;
	readonly muted:boolean;
}

export type VoiceUpdateListener = {

	onUpdateVoice:(voice:Voice) => void;
};

export type VoiceUpdateDispatcher = {

	add:(listener:VoiceUpdateListener) => void;

	delete:(listener:VoiceUpdateListener) => boolean;
};

export type VoiceUpdatable = Voice & {

	readonly onUpdateCallbacks:VoiceUpdateDispatcher;
}

export interface IVolumeManager extends Voice {

	setVolume(v:number):void;

	mute():void;

	unmute():void;
}

export type ISoundsConsumer = {

	produceSoundsPlayer(player:SoundStarter):void;
}
