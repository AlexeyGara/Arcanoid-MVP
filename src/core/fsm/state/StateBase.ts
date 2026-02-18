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
import type { CanBePaused }      from "@core-api/system-types";
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

	@final
	readonly stateId:TCustomSTATEid;

	@final
	get paused():boolean {
		return this._pauseManager?.paused || false;
	}

	abstract readonly overlayMode:StateOverlayMode;

	abstract readonly isOverlay:boolean;

	abstract readonly critical:boolean;

	private readonly _pauseManager?:CanBePaused;
	private readonly _modules:Array<HaveActivePhase & HaveEnterPhase<TEvents>>;
	private readonly _activePhaseModules:HaveActivePhase[];
	private readonly _stateContext?:StateContext;
	private _status:EStateStatus = EStateStatus.CREATED;

	/**
	 * Abstract StateBase constructor:
	 * @param stateId An unique id of this state.
	 * @param stateContext The state's modules owner. This is a fully-phases control for state modules.
	 * @param enterPhaseModules The 'enter' and 'activate'-phases modules. These modules are not controlled by StateContext (if StateContext is set) and not participate in the 'attach'-phase (attach to scene).
	 * @param onlyActivePhaseModules The only 'activate'-phases modules. These modules are not controlled by StateContext (if StateContext is set) and not participate in the 'attach' and 'enter'-phases.
	 * @param modulesPauseManager The pause manage associated with only {@link enterPhaseModules} and/or {@link onlyActivePhaseModules} modules.
	 * @protected
	 */
	protected constructor(
		stateId:TCustomSTATEid,
		stateContext?:StateContext,
		enterPhaseModules?:Array<HaveActivePhase & HaveEnterPhase<TEvents>>,
		onlyActivePhaseModules?:HaveActivePhase[],
		modulesPauseManager?:CanBePaused,
	) {
		this.stateId             = stateId;
		this._pauseManager       = modulesPauseManager;
		this._modules            = enterPhaseModules || [];
		this._activePhaseModules = onlyActivePhaseModules || [];
		this._stateContext       = stateContext;
	}

	@final
	pause():void {
		this._pauseManager?.pause();
		this._stateContext?.pause();
	}

	@final
	resume():void {
		this._pauseManager?.resume();
		this._stateContext?.resume();
	}

	@final
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

	@final
	async enter(payload:TEvents[keyof TEvents]):Promise<void> {
		if(this._status != EStateStatus.ATTACHED) {
			logger.warn(
				`[State] state "${this.stateId}" has status '${this._status}' and cannot be entered!`);
			return;
		}

		this._status = EStateStatus.ENTERING;

		await Promise.all([
							  this._stateContext?.doEnter(payload),
							  this.doEnter(payload)
						  ]).then();

		this._status = EStateStatus.ENTERED;
	}

	protected doEnter(payload:TEvents[keyof TEvents]):Promise<void> {
		const modulesStartWaiters:Promise<void>[] = [];

		for(const module of this._modules) {
			modulesStartWaiters.push(module.doEnter(payload));
		}

		return Promise.all(modulesStartWaiters).then();
	}

	@final
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

	@final
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

	@final
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

	@final
	detach():void {
		if(this._status != EStateStatus.ATTACHED) {
			logger.warn(`[State] state "${this.stateId}" has status '${this._status}' and cannot be detached!`);
			return;
		}

		this._stateContext?.doDetach();

		this._status = EStateStatus.CREATED;
	}

}