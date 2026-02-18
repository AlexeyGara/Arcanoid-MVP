/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: WorkerFrameRequester.ts
 * Path: src/platform/web/
 * Author: alexeygara
 * Last modified: 2026-01-10 00:59
 */

import type { IFrameRequester } from "@core-api/gameloop-types";
import { FrameRequester }       from "core/gameloop/FrameRequester";

export class WorkerFrameRequester extends FrameRequester implements IFrameRequester {
	private static _workerRequestFrameEvent = 'request_frame';
	private static _workerCancelFrameEvent = 'cancel_frame';

	private readonly _requestFrameWorkerName:string;
	private _requestFrameWorker?:Worker;
	private _uniqueAnimationFrame:number = 0;
	private _totalTime:number = 0;
	private _lastTime:number = 0;

	protected get requestFrameWorker():Worker {
		return this._requestFrameWorker ||= new Worker(this._requestFrameWorkerName);
	}

	constructor(frameWorkerName:string) {
		super();
		this._requestFrameWorkerName = frameWorkerName;
		this.onWorkerMessage = this.onWorkerMessage.bind(this);
		this.onWorkerError = this.onWorkerError.bind(this);
		this.onWorkerMessageError = this.onWorkerMessageError.bind(this);
	}

	requestNextFrame(cancelPrevious = true):void {
		if(this.requestedAnimationFrameId && !cancelPrevious) {
			return;
		}
		this.cancelRequestedFrame();
		this.requestFrameWorker.onmessage = this.onWorkerMessage;
		this.requestFrameWorker.onerror = this.onWorkerError;
		this.requestFrameWorker.onmessageerror = this.onWorkerMessageError;
		this.setAnimationFrameId(++this._uniqueAnimationFrame);
		this._lastTime = new Date().valueOf();
		this.requestFrameWorker.postMessage(WorkerFrameRequester._workerRequestFrameEvent);
	}

	protected onWorkerMessage = (_:MessageEvent):void => {
		this._totalTime += new Date().valueOf() - this._lastTime;
		this.onEnterFrame(this._totalTime);
	};

	protected onWorkerError = (e:ErrorEvent):void => {
		logger.error(`Worker error: ${e.message} at ${e.filename} : ${e.lineno}`);
	};

	protected onWorkerMessageError = (e:MessageEvent):void => {
		logger.error(`Worker message error: ${e.type}, ${e.data}`);
	};

	cancelRequestedFrame():void {
		if(this.requestedAnimationFrameId) {
			if(this._requestFrameWorker) {
				this._requestFrameWorker.postMessage(WorkerFrameRequester._workerCancelFrameEvent);
			}
			this.setAnimationFrameId();
		}
	}

	stop():void {
		if(this._requestFrameWorker) {
			this._requestFrameWorker.terminate();
			delete this._requestFrameWorker;
		}
	}
}