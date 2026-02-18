/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Chesstles-TS
 * File: StateBase.ts
 * Path: src/core/fsm/state/
 * Author: alexeygara
 * Last modified: 2026-01-22 21:07
 */

import type { IState }       from "@core-api/fsm-types";
import type {
	HaveActivePhase,
	HaveEnterPhase
}                            from "@core-api/module-types";
import type { StateContext } from "core/fsm/state/StateContext";

// eslint-disable-next-line @typescript-eslint/naming-convention
const EStateStatus = {
	CREATED  : "CREATED",
	ENTERING : "ENTERING",
	ENTERED  : "ENTERED",
	ACTIVE   : "ACTIVE",
	EXITING  : "EXITING",
} as const;

type EStateStatus = typeof EStateStatus[keyof typeof EStateStatus];

export abstract class StateBase<TCustomSTATEid extends STATEidBase, TEvents extends EventBase>
	implements IState<TCustomSTATEid, TEvents> {

	readonly stateId:TCustomSTATEid;
	private readonly _enterPhaseModules:Array<HaveActivePhase & HaveEnterPhase<TEvents>>;
	private readonly _activePhaseModules:HaveActivePhase[];
	private readonly _stateContext?:StateContext;
	private _status:EStateStatus = EStateStatus.CREATED;

	protected constructor(
		stateId:TCustomSTATEid,
		enterPhaseModules:Array<HaveActivePhase & HaveEnterPhase<TEvents>>,
		onlyActivePhaseModules:HaveActivePhase[],
		stateContext?:StateContext
	) {
		this.stateId = stateId;
		this._enterPhaseModules = enterPhaseModules;
		this._activePhaseModules = onlyActivePhaseModules;
		this._stateContext = stateContext;
	}

	async enter(payload?:TEvents[keyof TEvents]):Promise<void> {
		if(this._status != EStateStatus.CREATED) {
			logger.warn(
				`[State] state "${this.stateId}" has status '${this._status}' and cannot be entered right now!`);
			return;
		}

		this._status = EStateStatus.ENTERING;

		await Promise.all([
							  this._stateContext?.doEnter(),
							  this.doEnter(payload)
						  ]).then();

		this._status = EStateStatus.ENTERED;
	}

	protected doEnter(payload?:TEvents[keyof TEvents]):Promise<void> {
		const modulesStartWaiters:Promise<void>[] = [];

		for(const module of this._enterPhaseModules) {
			modulesStartWaiters.push(module.doEnter(payload));
		}

		return Promise.all(modulesStartWaiters).then();
	}

	start():void {
		if(this._status != EStateStatus.ENTERED) {
			logger.warn(
				`[State] state "${this.stateId}" has status '${this._status}' and cannot be started right now!`);
			return;
		}

		this._stateContext?.doStart();

		this.doStart();

		this._status = EStateStatus.ACTIVE;
	}

	protected doStart():void {
		for(const module of [...this._enterPhaseModules, ...this._activePhaseModules]) {
			if(!module.active) {
				module.activate();
			}
		}
	}

	stop():void {
		if(this._status != EStateStatus.ACTIVE) {
			logger.warn(
				`[State] state "${this.stateId}" has status '${this._status}' and cannot be stopped right now!`);
			return;
		}

		this.doStop();

		this._stateContext?.doStop();

		this._status = EStateStatus.ENTERED;
	}

	protected doStop():void {
		for(const module of [...this._enterPhaseModules, ...this._activePhaseModules]) {
			if(module.active) {
				module.deactivate();
			}
		}
	}

	async exit():Promise<void> {
		if(this._status != EStateStatus.ENTERED) {
			logger.warn(`[State] state "${this.stateId}" has status '${this._status}' and cannot be exited right now!`);
			return;
		}

		this._status = EStateStatus.EXITING;

		await Promise.all([
							  this.doExit(),
							  this._stateContext?.doExit()
						  ]).then();

		this._status = EStateStatus.CREATED;
	}

	protected doExit():Promise<void> {
		const modulesStartWaiters:Promise<void>[] = [];

		for(const module of this._enterPhaseModules) {
			modulesStartWaiters.push(module.doExit());
		}

		return Promise.all(modulesStartWaiters).then();
	}
}