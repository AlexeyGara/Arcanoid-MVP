/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Chesstles-TS
 * File: PixiAudioPlayer.ts
 * Path: src/core/api/audio/
 * Author: alexeygara
 * Last modified: 2026-01-29 16:18
 */

import type {
	AudioAssetID,
	AudioOptions,
	IAudioPlayer
}                     from "@core-api/audio-types";
import { UidService } from "@platform/engine/assets/UidService";

export class PixiAudioPlayer implements IAudioPlayer {

	get paused():boolean {
		return this._paused;
	}

	private _paused:boolean = false;

	pause():void {
		//TODO: implement method
	}

	resume():void {
		//TODO: implement method
	}

	play(audioAssetId:AudioAssetID, options?:AudioOptions):Promise<OnFinishResult> | false {
		const assetAlias = UidService.getUniqueAssetAlias(audioAssetId);

		//TODO: implement method
		logger.log(String(assetAlias));
		logger.log(options + '');

		return false;
	}

	stop(audioAssetId:AudioAssetID):boolean {
		const assetAlias = UidService.getUniqueAssetAlias(audioAssetId);

		//TODO: implement method
		logger.log(String(assetAlias));

		return false;
	}

	mute(audioAssetId:AudioAssetID):void {
		const assetAlias = UidService.getUniqueAssetAlias(audioAssetId);

		//TODO: implement method
		logger.log(String(assetAlias));
	}

	unmute(audioAssetId:AudioAssetID):void {
		const assetAlias = UidService.getUniqueAssetAlias(audioAssetId);

		//TODO: implement method
		logger.log(String(assetAlias));
	}

	setVolume(audioAssetId:AudioAssetID, v:number):void {
		const assetAlias = UidService.getUniqueAssetAlias(audioAssetId);

		//TODO: implement method
		logger.log(String(assetAlias));
		logger.log(v + '');
	}

	setLoop(audioAssetId:AudioAssetID, loop:boolean):void {
		const assetAlias = UidService.getUniqueAssetAlias(audioAssetId);

		//TODO: implement method
		logger.log(String(assetAlias));
		logger.log(loop + '');
	}

}