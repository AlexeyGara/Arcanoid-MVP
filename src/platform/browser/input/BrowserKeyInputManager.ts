/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: KeyInputManager.ts
 * Path: src/platform/browser/input/
 * Author: alexeygara
 * Last modified: 2026-02-22 12:32
 */

import { KeyInputManagerBase } from "core/input/KeyInputManagerBase";

type KeyEventName = "keydown" | "keyup";

// For a known keycodes @see https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_code_values

export class BrowserKeyInputManager<TKeyEventEmitterId extends SceneChildIdBase>
	extends KeyInputManagerBase<string, KeyEventName, TKeyEventEmitterId> {

	protected readonly keyDownEventName = "keydown";
	protected readonly keyUpEventName   = "keyup";

	private readonly _defaultTarget:EventTarget;
	private readonly _emittersProvider:(emitterId:TKeyEventEmitterId) => EventTarget;

	constructor(
		name:string,
		emittersProvider:(emitterId:TKeyEventEmitterId) => EventTarget,
		defaultTarget?:EventTarget,
	) {
		super(name);
		this._defaultTarget    = defaultTarget || window;
		this._emittersProvider = emittersProvider;
	}

	protected doRegistration(eventName:KeyEventName, keyCode:string,
							 emitterId:TKeyEventEmitterId | undefined,
							 handleCallback:() => void):() => void {

		const emitter = emitterId === undefined
						? this._defaultTarget
						: this._emittersProvider(emitterId);

		const keyboardEventHandler = (e:Event):void => {
			const keyEvent = e as KeyboardEvent;

			if(e.type == this.keyDownEventName && !keyEvent.repeat && keyEvent.code == keyCode) {
				handleCallback();
			}
		};

		emitter.addEventListener(eventName, keyboardEventHandler);

		return () => {
			emitter.removeEventListener(eventName, keyboardEventHandler);
		};
	}

}