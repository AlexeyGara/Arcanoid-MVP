/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: WindowFrameRequester.ts
 * Path: src/platform/browser/
 * Author: alexeygara
 * Last modified: 2026-01-29 22:59
 */

import type { IFrameRequester } from "@core-api/gameloop-types";
import { FrameRequester }       from "core/gameloop/FrameRequester";

export class WindowFrameRequester extends FrameRequester implements IFrameRequester {

	constructor() {
		super();
	}

	requestNextFrame(cancelPrevious:boolean):void {

		if(this.requestedAnimationFrameId && !cancelPrevious) {
			return;
		}
		this.cancelRequestedFrame();
		this.setAnimationFrameId(window.requestAnimationFrame(this.onEnterFrame));
	}

	cancelRequestedFrame():void {

		if(this.requestedAnimationFrameId) {
			window.cancelAnimationFrame(this.requestedAnimationFrameId);
			this.setAnimationFrameId();
		}
	}
}