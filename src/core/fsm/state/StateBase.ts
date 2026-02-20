/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Chesstles-TS
 * File: StateBase.ts
 * Path: src/core/fsm/state/
 * Author: alexeygara
 * Last modified: 2026-01-22 21:07
 */

import type { IState }           from "@core-api/fsm-types";
import type {
	HaveActivePhase,
	HaveEnterPhase
}                                from "@core-api/module-types";
import type { StateContext }     from "core/fsm/state/StateContext";
import type { StateOverlayMode } from "core/fsm/state/StateOverlayMode";

// eslint-disable-next-line @typescript-eslint/naming-convention
const EStateStatus = {
	CREATED:   "CREATED",
	ATTACHING: "attaching",
	ATTACHED:  "ATTACHED",
	ENTERING:  "entering",
	ENTERED:   "ENTERED",
	ACTIVE:    "ACTIVE",
	EXITING:   "exiting",
} as const;

type EStateStatus = typeof EStateStatus[keyof typeof EStateStatus];

export abstract class StateBase<TCustomSTATEid extends STATEidBase, TEvents extends EventBase>
	implements IState<TCustomSTATEid, TEvents> {

	readonly stateId:TCustomSTATEid;

	abstract readonly overlayMode:StateOverlayMode;

	abstract readonly isOverlay:boolean;

	abstract readonly critical:boolean;

	private readonly _modules:Array<HaveActivePhase & HaveEnterPhase<TEvents>>;
	private readonly _activePhaseModules:HaveActivePhase[];
	private readonly _stateContext?:StateContext;
	private _status:EStateStatus = EStateStatus.CREATED;

	protected constructor(
		stateId:TCustomSTATEid,
		modules:Array<HaveActivePhase & HaveEnterPhase<TEvents>>,
		onlyActivePhaseModules?:HaveActivePhase[],
		stateContext?:StateContext
	) {
		this.stateId             = stateId;
		this._modules            = modules;
		this._activePhaseModules = onlyActivePhaseModules || [];
		this._stateContext       = stateContext;
	}

	async attach():Promise<void> {
		if(this._status != EStateStatus.CREATED) {
			logger.warn(
				`[State] state "${this.stateId}" has status '${this._status}' and cannot be attached!`);
			return;
		}

		this._status = EStateStatus.ATTACHING;

		await this._stateContext?.doAttach();

		this._status = EStateStatus.ATTACHED;
	}

	async enter(payload?:TEvents[keyof TEvents]):Promise<void> {
		if(this._status != EStateStatus.ATTACHED) {
			logger.warn(
				`[State] state "${this.stateId}" has status '${this._status}' and cannot be entered!`);
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

		for(const module of this._modules) {
			modulesStartWaiters.push(module.doEnter(payload));
		}

		return Promise.all(modulesStartWaiters).then();
	}

	start():void {
		if(this._status != EStateStatus.ENTERED) {
			logger.warn(
				`[State] state "${this.stateId}" has status '${this._status}' and cannot be started!`);
			return;
		}

		this._stateContext?.doStart();

		this.doStart();

		this._status = EStateStatus.ACTIVE;
	}

	protected doStart():void {
		for(const module of [...this._modules, ...this._activePhaseModules]) {
			if(!module.active) {
				module.activate();
			}
		}
	}

	stop():void {
		if(this._status != EStateStatus.ACTIVE) {
			logger.warn(
				`[State] state "${this.stateId}" has status '${this._status}' and cannot be stopped!`);
			return;
		}

		this.doStop();

		this._stateContext?.doStop();

		this._status = EStateStatus.ENTERED;
	}

	protected doStop():void {
		for(const module of [...this._modules, ...this._activePhaseModules]) {
			if(module.active) {
				module.deactivate();
			}
		}
	}

	async exit():Promise<void> {
		if(this._status != EStateStatus.ENTERED) {
			logger.warn(`[State] state "${this.stateId}" has status '${this._status}' and cannot be exited!`);
			return;
		}

		this._status = EStateStatus.EXITING;

		await Promise.all([
							  this.doExit(),
							  this._stateContext?.doExit()
						  ]).then();

		this._status = EStateStatus.ATTACHED;
	}

	protected doExit():Promise<void> {
		const modulesStartWaiters:Promise<void>[] = [];

		for(const module of this._modules) {
			modulesStartWaiters.push(module.doExit());
		}

		return Promise.all(modulesStartWaiters).then();
	}

	detach():void {
		if(this._status != EStateStatus.ATTACHED) {
			logger.warn(`[State] state "${this.stateId}" has status '${this._status}' and cannot be detached!`);
			return;
		}

		this._stateContext?.doDetach();

		this._status = EStateStatus.CREATED;
	}

}