/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Chesstles-TS
 * File: FrameRequester.ts
 * Author: alexeygara
 * Last modified: 2026-01-05 17:51
 */

import type {
	AnimationFrameReceiver,
	IFrameRequester
} from "@core-api/gameloop-types";

export abstract class FrameRequester implements IFrameRequester {
	private _requestedAnimationFrameId:number = 0;
	private _frameReceiver:AnimationFrameReceiver | null = null;

	protected constructor() {
		this.onEnterFrame = this.onEnterFrame.bind(this);
	}

	get requestedAnimationFrameId():number {
		return this._requestedAnimationFrameId;
	}

	protected setAnimationFrameId(value:number = 0):void {
		this._requestedAnimationFrameId = value;
	}

	abstract requestNextFrame(cancelPrevious:boolean):void;

	abstract cancelRequestedFrame():void;

	protected onEnterFrame(totalTime:number):void {
		this.setAnimationFrameId();
		this._frameReceiver?.(totalTime);
	}

	setFrameReceiver(frameReceiver:AnimationFrameReceiver):void {
		this._frameReceiver = frameReceiver;
	}
}