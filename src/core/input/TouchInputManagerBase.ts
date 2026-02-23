/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: TouchInputManagerBase.ts
 * Path: src/core/input/
 * Author: alexeygara
 * Last modified: 2026-02-22 23:07
 */

import type { IDestroyable } from "@core-api/base-types";
import type {
	GameLoopPhaseActor,
	GameTime,
	IGameLoopUpdatable
}                            from "@core-api/gameloop-types";
import type {
	ITouchInputDispatcher,
	TouchInputData,
	TouchType
}                            from "@core-api/input-types";
import type { AppSystem }    from "@core-api/system-types";
import { GameLoopPhase }     from "core/gameloop/GameLoopPhase";

type StorageData<TTouchType extends TouchType, TTouchEventEmitterId extends SceneChildIdBase>
	= Required<TouchInputData<TTouchType>>
	  & {
		  target:TouchInputData<TTouchType>;
		  subscribes:Map<TTouchEventEmitterId | typeof notSetEventEmitter, Set<() => void>>;
	  };

const notSetEventEmitter = {};

export abstract class TouchInputManagerBase<TTouchType extends TouchType,
	TTouchEventEmitterId extends SceneChildIdBase>

	implements ITouchInputDispatcher<TTouchType, TTouchEventEmitterId>,
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

	private readonly _storage:StorageData<TTouchType, TTouchEventEmitterId>[]  = [];
	private readonly _map:Map<TouchInputData<TTouchType>, number>              = new Map();
	private readonly _dirty:Set<StorageData<TTouchType, TTouchEventEmitterId>> = new Set();

	protected constructor(
		name:string
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
	isTouchRegistered(inputDataStorage:TouchInputData<TTouchType>, emitterId?:TTouchEventEmitterId):boolean {
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
	registerTouch(inputDataStorage:TouchInputData<TTouchType>, emitterId?:TTouchEventEmitterId):void {
		if(this.destroyed) {
			return;
		}

		if(this.isTouchRegistered(inputDataStorage, emitterId)) {
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

		// keep unsubscriber for touch-start handler:
		unsubscribers.add(
			this.doRegistration(
				"start", inputDataStorage.touchType, emitterId,
				(posX:number, posY:number) => this._onTouchStartHandler(storageData!, posX, posY))
		);

		// keep unsubscriber for touch-move handler:
		unsubscribers.add(
			this.doRegistration(
				"move", inputDataStorage.touchType, emitterId,
				(posX:number, posY:number) => this._onTouchMoveHandler(storageData!, posX, posY))
		);

		// keep unsubscriber for touch-end handler:
		unsubscribers.add(
			this.doRegistration(
				"end", inputDataStorage.touchType, emitterId,
				(posX:number, posY:number) => this._onTouchEndtHandler(storageData!, posX, posY))
		);
	}

	protected abstract doRegistration(touchPhase:"start" | "move" | "end",
									  touchType:TTouchType,
									  emitterId:TTouchEventEmitterId | undefined,
									  handleCallback:(posX:number, posY:number) => void):() => void;

	@final
	deregisterTouch(inputDataStorage:TouchInputData<TTouchType>, emitterId?:TTouchEventEmitterId):void {
		if(this.destroyed) {
			return;
		}

		if(!this.isTouchRegistered(inputDataStorage, emitterId)) {
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

	@final
	unregisterAll():void {

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
	}

	private _onTouchStartHandler(storageData:StorageData<TTouchType, TTouchEventEmitterId>,
								 posX:number, posY:number):void {

		this._dirty.add(storageData);

		if(!storageData.isContinue) {
			storageData.lastContinueDurationMs = 0;
		}

		storageData.isContinue = true;
		storageData.startX     = posX;
		storageData.startY     = posY;

		storageData.currX = posX;
		storageData.currY = posY;
		storageData.endX  = posX;
		storageData.endY  = posY;

		if(this.paused) {
			// nothing to prevent by pause
		}
	}

	private _onTouchMoveHandler(storageData:StorageData<TTouchType, TTouchEventEmitterId>,
								posX:number, posY:number):void {
		if(this.paused) {
			return;
		}

		this._dirty.add(storageData);

		storageData.currX = posX;
		storageData.currY = posY;
	}

	private _onTouchEndtHandler(storageData:StorageData<TTouchType, TTouchEventEmitterId>,
								posX:number, posY:number):void {

		this._dirty.add(storageData);

		storageData.isContinue = false;
		storageData.endX       = posX;
		storageData.endY       = posY;

		if(this.paused) {
			// nothing to prevent by pause
		}
	}

	@final
	update(time:GameTime):void {
		if(this.destroyed || this.paused) {
			return;
		}

		for(const localInput of this._dirty) {
			if(localInput.isContinue) {
				if(localInput.lastContinueDurationMs === 0) {
					// touch was started just between updates,
					// so there is wrong to increase it a whole delta-time value:
					localInput.lastContinueDurationMs = 1;
				}
				else {
					localInput.lastContinueDurationMs += time.deltaTimeMs;
				}
			}

			this._alignLocalToTarget(localInput, localInput.target);
		}

		this._dirty.clear();
	}

	@final
	destroy():void {

		this.unregisterAll();

		this.doDestroy?.();

		(this.destroyed as Writeable<boolean>) = true;
	}

	protected doDestroy?():void;

	private _getStorageData(inputDataStorage:TouchInputData<TTouchType>):StorageData<TTouchType, TTouchEventEmitterId> | undefined {

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

	private _createStorageData(inputDataStorage:TouchInputData<TTouchType>):StorageData<TTouchType, TTouchEventEmitterId> {

		return {
			touchType: inputDataStorage.touchType,

			isContinue:             false,
			lastContinueDurationMs: 0,

			startX: 0,
			startY: 0,
			currX:  0,
			currY:  0,
			endX:   0,
			endY:   0,

			target:     inputDataStorage,
			subscribes: new Map()
		};
	}

	private _alignLocalToTarget(localInput:StorageData<TTouchType, TTouchEventEmitterId>,
								targetInput:TouchInputData<TTouchType>):void {

		if(targetInput.isContinue !== undefined) {
			targetInput.isContinue = localInput.isContinue;
		}
		if(targetInput.startX !== undefined) {
			targetInput.startX = localInput.startX;
		}
		if(targetInput.startY !== undefined) {
			targetInput.startY = localInput.startY;
		}
		if(targetInput.endX !== undefined) {
			targetInput.endX = localInput.endX;
		}
		if(targetInput.endY !== undefined) {
			targetInput.endY = localInput.endY;
		}
	}

}