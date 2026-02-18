/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: InputManager.ts
 * Path: src/core/input/
 * Author: alexeygara
 * Last modified: 2026-02-22 11:25
 */

import type { IDestroyable } from "@core-api/base-types";
import type {
	GameLoopPhaseActor,
	GameTime,
	IGameLoopUpdatable
}                            from "@core-api/gameloop-types";
import type {
	IKeyInputDispatcher,
	KeyCode,
	KeyInputData,
}                            from "@core-api/input-types";
import type { AppSystem }    from "@core-api/system-types";
import { GameLoopPhase }     from "core/gameloop/GameLoopPhase";

type StorageData<TKeyCode extends KeyCode, TKeyEventEmitterId extends SceneChildIdBase>
	= Required<KeyInputData<TKeyCode>>
	  & {
		  target:KeyInputData<TKeyCode>;
		  subscribes:Map<TKeyEventEmitterId | typeof notSetEventEmitter, Set<() => void>>;
	  };

const notSetEventEmitter = {};

export abstract class KeyInputManagerBase<TKeyCode extends KeyCode,
	TKeyEventName extends string,
	TKeyEventEmitterId extends SceneChildIdBase>

	implements IKeyInputDispatcher<TKeyCode, TKeyEventEmitterId>,
			   GameLoopPhaseActor<typeof GameLoopPhase.INPUT>,
			   IGameLoopUpdatable,
			   AppSystem,
			   IDestroyable {

	@final
	readonly updatePhase = GameLoopPhase.INPUT;

	readonly name:string;

	@final
	readonly destroyed:boolean = false;

	readonly paused:boolean = false;

	protected abstract readonly keyDownEventName:TKeyEventName;
	protected abstract readonly keyUpEventName:TKeyEventName;

	private readonly _storage:StorageData<TKeyCode, TKeyEventEmitterId>[]  = [];
	private readonly _map:Map<KeyInputData<TKeyCode>, number>              = new Map();
	private readonly _dirty:Set<StorageData<TKeyCode, TKeyEventEmitterId>> = new Set();

	protected constructor(
		name:string,
	) {
		this.name = name;
	}

	@final
	pause():void {
		(this.paused as Writeable<boolean>) = true;
	}

	@final
	resume():void {
		(this.paused as Writeable<boolean>) = false;
	}

	@final
	isKeyRegistered(inputDataStorage:KeyInputData<TKeyCode>, emitterId?:TKeyEventEmitterId):boolean {
		if(this.destroyed) {
			return false;
		}

		const storageData = this._getStorageData(inputDataStorage);
		if(!storageData) {
			return false;
		}

		const emitterTarget = emitterId || notSetEventEmitter;

		for(const emitter of storageData.subscribes.keys()) {
			if(emitter == emitterTarget) {
				return true;
			}
		}

		return false;
	}

	@final
	registerKey(inputDataStorage:KeyInputData<TKeyCode>, emitterId?:TKeyEventEmitterId):void {
		if(this.destroyed) {
			return;
		}

		if(this.isKeyRegistered(inputDataStorage, emitterId)) {
			return;
		}

		let storageData = this._getStorageData(inputDataStorage);

		if(!storageData) {
			storageData = this._createStorageData(inputDataStorage);

			this._storage.push(storageData);
			this._map.set(inputDataStorage, this._storage.length - 1);
		}

		const emitterTarget = emitterId || notSetEventEmitter;

		const unsubscribers = storageData.subscribes.get(emitterTarget) || new Set();
		storageData.subscribes.set(emitterTarget, unsubscribers);

		// keep unsubscriber for down-handler:
		unsubscribers.add(
			this.doRegistration(this.keyDownEventName, inputDataStorage.keyCode, emitterId,
								() => this._onKeyDownHandler(storageData!))
		);

		// keep unsubscriber for up-handler:
		unsubscribers.add(
			this.doRegistration(this.keyUpEventName, inputDataStorage.keyCode, emitterId,
								() => this._onKeyUpHandler(storageData!))
		);
	}

	protected abstract doRegistration(eventName:TKeyEventName,
									  keyCode:TKeyCode,
									  emitterId:TKeyEventEmitterId | undefined,
									  handleCallback:() => void):() => void;

	@final
	deregisterKey(inputDataStorage:KeyInputData<TKeyCode>, emitterId?:TKeyEventEmitterId):void {
		if(this.destroyed) {
			return;
		}

		if(!this.isKeyRegistered(inputDataStorage, emitterId)) {
			return;
		}

		const storageData = this._getStorageData(inputDataStorage)!;

		const emitterTarget = emitterId || notSetEventEmitter;

		for(const emitter of storageData.subscribes.keys()) {
			if(emitter == emitterTarget) {
				for(const unsub of storageData.subscribes.get(emitter)!) {
					unsub();
				}
				storageData.subscribes.delete(emitter);
				break;
			}
		}

		if(!storageData.subscribes.size) {
			const storageIndex = this._storage.indexOf(storageData);

			if(storageIndex != this._map.get(inputDataStorage)) {
				logger.warn(
					`[KeyInputManager]: Wrong storage index - index is ${storageIndex}, but expected ${this._map.get(
						inputDataStorage)}`);
			}

			this._storage.splice(storageIndex, 1);
			this._map.delete(inputDataStorage);
		}
	}

	private _onKeyDownHandler(storageData:StorageData<TKeyCode, TKeyEventEmitterId>):void {

		this._dirty.add(storageData);

		if(!storageData.isDown) {
			storageData.lastDownDurationMs = 0;
		}
		storageData.isDown = true;

		if(this.paused) {
			return;
		}

		storageData.downCounter++;
	}

	private _onKeyUpHandler(storageData:StorageData<TKeyCode, TKeyEventEmitterId>):void {

		this._dirty.add(storageData);

		storageData.isDown = false;

		if(this.paused) {
			return;
		}

		storageData.upCounter++;
	}

	@final
	update(time:GameTime):void {
		if(this.destroyed || this.paused) {
			return;
		}

		for(const localInput of this._dirty) {
			if(localInput.isDown) {
				if(localInput.lastDownDurationMs === 0) {
					// key was pressed just between updates,
					// so there is wrong to increase it a whole delta-time value:
					localInput.lastDownDurationMs = 1;
				}
				else {
					localInput.lastDownDurationMs += time.deltaTimeMs;
				}
			}

			this._alignLocalToTarget(localInput, localInput.target);

			localInput.downCounter = 0;
			localInput.upCounter   = 0;
		}

		this._dirty.clear();
	}

	@final
	destroy():void {

		this._dirty.clear();

		this._map.clear();

		for(const storeData of this._storage) {
			for(const subs of storeData.subscribes.values()) {
				for(const unsub of subs) {
					unsub();
				}
			}
		}
		this._storage.length = 0;

		this.doDestroy?.();

		(this.destroyed as Writeable<boolean>) = true;
	}

	protected doDestroy?():void;

	private _getStorageData(inputDataStorage:KeyInputData<TKeyCode>):StorageData<TKeyCode, TKeyEventEmitterId> | undefined {

		const storageIndex = this._map.get(inputDataStorage);
		if(storageIndex === undefined) {
			return;
		}

		const storageData = this._storage[storageIndex];
		if(!storageData) {
			return;
		}

		return storageData;
	}

	private _createStorageData(inputDataStorage:KeyInputData<TKeyCode>):StorageData<TKeyCode, TKeyEventEmitterId> {

		return {
			keyCode: inputDataStorage.keyCode,

			isDown:             false,
			lastDownDurationMs: 0,
			downCounter:        0,
			upCounter:          0,

			target:     inputDataStorage,
			subscribes: new Map()
		};
	}

	private _alignLocalToTarget(localInput:StorageData<TKeyCode, TKeyEventEmitterId>,
								targetInput:KeyInputData<TKeyCode>):void {

		if(targetInput.isDown !== undefined) {
			targetInput.isDown = localInput.isDown;
		}
		if(targetInput.lastDownDurationMs !== undefined) {
			targetInput.lastDownDurationMs = localInput.lastDownDurationMs;
		}
		if(targetInput.downCounter !== undefined) {
			targetInput.downCounter = localInput.downCounter;
		}
		if(targetInput.upCounter !== undefined) {
			targetInput.upCounter = localInput.upCounter;
		}
	}

}