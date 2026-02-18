/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Chesstles-TS
 * File: PixiButton.ts
 * Author: alexeygara
 * Last modified: 2026-01-13 23:01
 */

import type { FancyButton as PixiButton } from "@pixi/ui";
import type { InteractEventType }         from "@platform/engine/interraction";
import { InteractMode }                   from "@platform/engine/interraction";
import type { SceneResourceType }         from "@platform/engine/resources";
import { ButtonResName }                  from "@platform/engine/resources";
import type {
	IInteractiveEmitterNodeUI,
	InteractEvent,
	InteractEventCallback,
	InteractEventHandler
}                                         from "@platform/engine/ui/nodes";
import { PixiNode }                       from "@platform/pixi/ui/PixiNode";
import type { FederatedPointerEvent }     from "pixi.js";

export class PixiNodeButton
	extends PixiNode
	implements IInteractiveEmitterNodeUI {

	override readonly resType:SceneResourceType = ButtonResName;

	private _listeners:Map<InteractEventType, Set<InteractEventHandler>> = new Map();
	private _onceListeners:Map<InteractEventType, Set<InteractEventHandler>> = new Map();
	private _onPointerTap:InteractEventCallback | undefined;
	private _onPointerDown:InteractEventCallback | undefined;
	private _onPointerUp:InteractEventCallback | undefined;
	private _onPointerUpOutside:InteractEventCallback | undefined;
	private _onPointerMove:InteractEventCallback | undefined;
	private _onPointerOver:InteractEventCallback | undefined;
	private _onPointerOut:InteractEventCallback | undefined;
	private _onPointerCancel:InteractEventCallback | undefined;

	constructor(pixiObject:PixiButton,
				releaseAsset:() => void,
				originSizeGetters:{ getWidth():number; getHeight():number },
				id?:string,
	) {
		super(
			pixiObject,
			releaseAsset,
			id,
			originSizeGetters
		);
		this._pixiObject.interactive = true;
		this._pixiObject.eventMode = InteractMode.STATIC;
		this._pixiObject.interactiveChildren = true;
	}

	override set interactive(value:boolean) {
		if(this._interactive == value) {
			return;
		}

		this._interactive = value;

		this._pixiObject.interactive = value;
		this._pixiObject.eventMode = value ? InteractMode.STATIC : InteractMode.NONE;
	}

	/** Fired when a pointer performs a quick tap. */
	get onPointerTap():InteractEventCallback | undefined {
		return this._onPointerTap;
	}

	set onPointerTap(callback:InteractEventCallback | undefined) {
		this._onPointerTap = callback;
		if(this._onPointerTap) {
			this._pixiObject.onpointertap = (e:FederatedPointerEvent):void => {
				this._emitPointerEvent(e, this._onPointerTap);
			};
		}
		else {
			delete this._pixiObject.onpointertap;
		}
	}

	/** Fired when a pointer (mouse, pen, or touch) is pressed on a display object. */
	get onPointerDown():InteractEventCallback | undefined {
		return this._onPointerDown;
	}

	set onPointerDown(callback:InteractEventCallback | undefined) {
		this._onPointerDown = callback;
		if(this._onPointerDown) {
			this._pixiObject.onpointerdown = (e:FederatedPointerEvent):void => {
				this._emitPointerEvent(e, this._onPointerDown);
			};
		}
		else {
			delete this._pixiObject.onpointerdown;
		}
	}

	/** Fired when the pointer is released over the display object. */
	get onPointerUp():InteractEventCallback | undefined {
		return this._onPointerUp;
	}

	set onPointerUp(callback:InteractEventCallback | undefined) {
		this._onPointerUp = callback;
		if(this._onPointerUp) {
			this._pixiObject.onpointerup = (e:FederatedPointerEvent):void => {
				this._emitPointerEvent(e, this._onPointerUp);
			};
		}
		else {
			delete this._pixiObject.onpointerup;
		}
	}

	/** Fired when the pointer is released outside the object that received pointerdown. */
	get onPointerUpOutside():InteractEventCallback | undefined {
		return this._onPointerUpOutside;
	}

	set onPointerUpOutside(callback:InteractEventCallback | undefined) {
		this._onPointerUpOutside = callback;
		if(this._onPointerUpOutside) {
			this._pixiObject.onpointerupoutside = (e:FederatedPointerEvent):void => {
				this._emitPointerEvent(e, this._onPointerUpOutside);
			};
		}
		else {
			delete this._pixiObject.onpointerupoutside;
		}
	}

	/** Fired when the pointer moves over the display object. */
	get onPointerMove():InteractEventCallback | undefined {
		return this._onPointerMove;
	}

	set onPointerMove(callback:InteractEventCallback | undefined) {
		this._onPointerMove = callback;
		if(this._onPointerMove) {
			this._pixiObject.onpointermove = (e:FederatedPointerEvent):void => {
				this._emitPointerEvent(e, this._onPointerMove);
			};
		}
		else {
			delete this._pixiObject.onpointermove;
		}
	}

	/** Fired when the pointer enters the boundary of the object. */
	get onPointerOver():InteractEventCallback | undefined {
		return this._onPointerOver;
	}

	set onPointerOver(callback:InteractEventCallback | undefined) {
		this._onPointerOver = callback;
		if(this._onPointerOver) {
			this._pixiObject.onpointerover = (e:FederatedPointerEvent):void => {
				this._emitPointerEvent(e, this._onPointerOver);
			};
		}
		else {
			delete this._pixiObject.onpointerover;
		}
	}

	/** Fired when the pointer leaves the boundary of the display object. */
	get onPointerOut():InteractEventCallback | undefined {
		return this._onPointerOut;
	}

	set onPointerOut(callback:InteractEventCallback | undefined) {
		this._onPointerOut = callback;
		if(this._onPointerOut) {
			this._pixiObject.onpointerout = (e:FederatedPointerEvent):void => {
				this._emitPointerEvent(e, this._onPointerOut);
			};
		}
		else {
			delete this._pixiObject.onpointerout;
		}
	}

	/** Fired when the pointer interaction is canceled (e.g. touch lost). */
	get onPointerCancel():InteractEventCallback | undefined {
		return this._onPointerCancel;
	}

	set onPointerCancel(callback:InteractEventCallback | undefined) {
		this._onPointerCancel = callback;
		if(this._onPointerCancel) {
			this._pixiObject.onpointercancel = (e:FederatedPointerEvent):void => {
				this._emitPointerEvent(e, this._onPointerCancel);
			};
		}
		else {
			delete this._pixiObject.onpointercancel;
		}
	}

	on(eventType:InteractEventType, handler:InteractEventHandler, once?:boolean):void {
		if(once) {
			const onceList = this._onceListeners.get(eventType) || new Set();
			onceList.add(handler);
			this._onceListeners.set(eventType, onceList);

			this._listeners.get(eventType)?.delete(handler);

			return;
		}

		const list = this._listeners.get(eventType) || new Set();
		list.add(handler);
		this._listeners.set(eventType, list);

		this._onceListeners.get(eventType)?.delete(handler);
	}

	off(eventType:InteractEventType, handler:InteractEventHandler):void {
		this._onceListeners.get(eventType)?.delete(handler);
		this._listeners.get(eventType)?.delete(handler);
	}

	private _createEventFrom(pixiEvent:FederatedPointerEvent):InteractEvent {
		return {
			isTrusted: pixiEvent.isTrusted,
			defaultPrevented: pixiEvent.defaultPrevented,

			type: pixiEvent.type as InteractEventType,
			pointerId: pixiEvent.pointerId as int,
			posX: pixiEvent.clientX,
			posY: pixiEvent.clientY,
			globalX: pixiEvent.globalX,
			globalY: pixiEvent.globalY,
			movementX: pixiEvent.movementX,
			movementY: pixiEvent.movementY,
			timeStamp: pixiEvent.timeStamp as uintMoreZero,
		};
	}

	private _emitPointerEvent(pixiEvent:FederatedPointerEvent, callback?:InteractEventCallback):void {
		if(!callback) {
			return;
		}

		pixiEvent.preventDefault();
		pixiEvent.stopImmediatePropagation();

		const event = this._createEventFrom(pixiEvent);

		callback(event);

		let listeners = this._listeners.get(event.type);
		if(listeners) {
			for(const listener of [...listeners]) {
				listener(event);
			}
		}

		listeners = this._onceListeners.get(event.type);
		this._onceListeners.delete(event.type);
		if(listeners) {
			for(const listener of listeners) {
				listener(event);
			}
		}
	}
}