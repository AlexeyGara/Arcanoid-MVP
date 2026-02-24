/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: BrowserTouchInputManager.ts
 * Path: src/platform/browser/input/
 * Author: alexeygara
 * Last modified: 2026-02-23 00:11
 */

import { getDPR }                from "@browser/index";
import type { TouchType }        from "@core-api/input-types";
import { InteractEventType }     from "@platform/engine/interraction";
import { TouchInputManagerBase } from "core/input/TouchInputManagerBase";

// For a known pointer types @see https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events

export class BrowserTouchInputManager<TTouchEventEmitterId extends SceneChildIdBase>
	extends TouchInputManagerBase<TTouchEventEmitterId> {

	private readonly _dpr:number;
	private readonly _defaultTarget:EventTarget;
	private readonly _emittersProvider:(emitterId:TTouchEventEmitterId) => EventTarget;

	constructor(
		name:string,
		useDPR:boolean,
		emittersProvider:(emitterId:TTouchEventEmitterId) => EventTarget,
		defaultTarget?:EventTarget,
	) {
		super(name);
		this._dpr              = useDPR ? getDPR() : 1;
		this._defaultTarget    = defaultTarget || window;
		this._emittersProvider = emittersProvider;
	}

	protected doRegistration(touchPhase:"start" | "move" | "end", touchType:TouchType,
							 emitterId:TTouchEventEmitterId | undefined,
							 handleCallback:(posX:number, posY:number) => void):() => void {

		const emitter = emitterId === undefined
						? this._defaultTarget
						: this._emittersProvider(emitterId);

		if(touchType != "pointer") {
			logger.warn(`[BrowserTouchInputManager:] Touch type '${touchType}' not implemented!`);
		}

		const isLocked = document.pointerLockElement !== null;
		if(isLocked) {
			logger.warn(`[BrowserTouchInputManager:] Pointer is locked! This mode is not implemented!`);
		}

		switch(touchPhase) {
			case 'start':
				return this._registerStartPhase(emitter, handleCallback);

			case 'move':
				return this._registerMovePhase(emitter, handleCallback);

			case 'end':
				return this._registerEndPhase(emitter, handleCallback);

			default:
				assertNever(touchPhase);
		}
	}

	private _registerStartPhase(emitter:EventTarget, handleCallback:(posX:number, posY:number) => void):() => void {

		const pointerDownEventHandler = (e:Event):void => {
			const pointerEvent = e as PointerEvent;

			//pointerEvent.preventDefault();
			//pointerEvent.stopImmediatePropagation();

			//pointerEvent.clientX
			//pointerEvent.clientY
			//pointerEvent.pageX
			//pointerEvent.pageY
			//pointerEvent.offsetX
			//pointerEvent.offsetY
			//pointerEvent.movementX
			//pointerEvent.movementY

			//pointerEvent.eventPhase
			//pointerEvent.timeStamp
			//pointerEvent.pointerId
			//pointerEvent.isTrusted
			//pointerEvent.defaultPrevented

			const element = emitter as HTMLElement;
			element.releasePointerCapture(pointerEvent.pointerId);

			handleCallback(pointerEvent.clientX * this._dpr,
						   pointerEvent.clientY * this._dpr);
		};

		emitter.addEventListener(InteractEventType.POINTER_DOWN, pointerDownEventHandler);

		return () => {
			emitter.removeEventListener(InteractEventType.POINTER_DOWN, pointerDownEventHandler);
		};
	}

	private _registerMovePhase(emitter:EventTarget, handleCallback:(posX:number, posY:number) => void):() => void {

		const pointerMoveEventHandler = (e:Event):void => {
			const pointerEvent = e as PointerEvent;

			//const dx = pointerEvent.movementX * this._dpr;
			//const dy = pointerEvent.movementY * this._dpr;

			handleCallback(pointerEvent.clientX * this._dpr,
						   pointerEvent.clientY * this._dpr);
		};

		emitter.addEventListener(InteractEventType.POINTER_MOVE, pointerMoveEventHandler);

		return () => {
			emitter.removeEventListener(InteractEventType.POINTER_MOVE, pointerMoveEventHandler);
		};
	}

	private _registerEndPhase(emitter:EventTarget, handleCallback:(posX:number, posY:number) => void):() => void {

		const pointerEndEventHandler = (e:Event):void => {
			const pointerEvent = e as PointerEvent;

			const element = emitter as HTMLElement;
			element.releasePointerCapture(pointerEvent.pointerId);

			handleCallback(pointerEvent.clientX * this._dpr,
						   pointerEvent.clientY * this._dpr);
		};

		emitter.addEventListener(InteractEventType.POINTER_UP, pointerEndEventHandler);
		emitter.addEventListener(InteractEventType.POINTER_CANCEL, pointerEndEventHandler);

		return () => {
			emitter.removeEventListener(InteractEventType.POINTER_UP, pointerEndEventHandler);
			emitter.removeEventListener(InteractEventType.POINTER_CANCEL, pointerEndEventHandler);
		};
	}

}