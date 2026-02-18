/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Chesstles-TS
 * File: StateContext.ts
 * Path: src/core/fsm/state/
 * Author: alexeygara
 * Last modified: 2026-01-22 19:53
 */

import type {
	IStateAttachStrategy,
	IStateEnterStrategy,
	IStateStartStrategy
}                           from "@core-api/fsm-types";
import type {
	HaveActivePhase,
	HaveDestroyPhase,
	HaveEnterPhase,
	IModule
}                           from "@core-api/module-types";
import type {
	ISceneHost,
	IScenesManager
}                           from "@core-api/scene-types";
import type { CanBePaused } from "@core-api/system-types";

export class StateContext<TScenesId extends SceneIdBase = SceneIdBase,
	TCustomSceneId extends TScenesId = TScenesId,
	TSceneLayersId extends SceneLayersIdBase = SceneLayersIdBase,
	TSceneChildrenId extends SceneChildIdBase = SceneChildIdBase,
	TEvent extends EventBase = EventBase>

	implements IStateAttachStrategy,
			   IStateEnterStrategy<TEvent>,
			   IStateStartStrategy,
			   CanBePaused {

	@final
	readonly sceneId:TCustomSceneId;

	@final
	get paused():boolean {
		return this._pauseManager.paused;
	}

	private readonly _pauseManager:CanBePaused;
	private readonly _sceneModules:IModule<TEvent, TSceneLayersId, TSceneChildrenId>[];
	private readonly _sceneManager:IScenesManager<TScenesId, TSceneLayersId, TSceneChildrenId>;
	private _scene!:ISceneHost<TSceneLayersId, TSceneChildrenId>;
	private readonly _enterFinishHook?:() => Promise<void>;
	private readonly _exitStartHook?:() => Promise<void>;
	private readonly _detachStartHook?:() => void;

	/**
	 * States Context constructor.
	 * @param sceneId An unique id of scene where modules will be attaching.
	 * @param pauseManager A pause manager associated with own modules.
	 * @param sceneModules An own modules for control them all phases: 'attach/detach', 'enter/exit' and 'activate/deactivate'.
	 * @param sceneManager
	 * @param enterFinishHook
	 * @param exitStartHook
	 * @param detachStartHook
	 */
	constructor(
		sceneId:TCustomSceneId,
		pauseManager:CanBePaused,
		sceneModules:IModule<TEvent, TSceneLayersId, TSceneChildrenId>[],
		sceneManager:IScenesManager<TScenesId, TSceneLayersId, TSceneChildrenId>,
		enterFinishHook?:() => Promise<void>,
		exitStartHook?:() => Promise<void>,
		detachStartHook?:() => void
	) {
		this.sceneId          = sceneId;
		this._pauseManager    = pauseManager;
		this._sceneModules    = sceneModules;
		this._sceneManager    = sceneManager;
		this._enterFinishHook = enterFinishHook;
		this._exitStartHook   = exitStartHook;
		this._detachStartHook = detachStartHook;
	}

	@final
	pause():void {
		this._pauseManager.pause();
	}

	@final
	resume():void {
		this._pauseManager.resume();
	}

	@final
	async doAttach():Promise<void> {
		this._scene = await this.showScene(this.sceneId, this._sceneManager);
		this.attachModulesTo(this._scene, this._sceneModules);
	}

	@final
	async doEnter(payload:TEvent[keyof TEvent]):Promise<void> {
		await this.enterModules(this._sceneModules, payload);

		await this._enterFinishHook?.();
	}

	@final
	doStart():void {
		this.activateModules(this._sceneModules);
	}

	@final
	doStop():void {
		this.deactivateModules(this._sceneModules);
	}

	@final
	async doExit():Promise<void> {
		await this._exitStartHook?.();

		await this.exitModules(this._sceneModules);
	}

	@final
	doDetach():void {
		this._detachStartHook?.();

		this.detachModules(this._scene, this._sceneModules);
		this.destroyModules(this._sceneModules);
		this.hideScene(this._scene, this._sceneManager);
	}

	protected async showScene(
		sceneId:TScenesId,
		scenesManager:IScenesManager<TScenesId, TSceneLayersId, TSceneChildrenId>
	):Promise<ISceneHost<TSceneLayersId, TSceneChildrenId>> {

		return await scenesManager.show(sceneId);
	}

	protected attachModulesTo(
		scene:ISceneHost<TSceneLayersId, TSceneChildrenId>,
		modules:IModule<TEvent, TSceneLayersId, TSceneChildrenId>[]
	):void {

		for(const module of modules) {
			module.attachToScene(scene);
		}
	}

	protected enterModules(
		modules:HaveEnterPhase<TEvent>[],
		payload:TEvent[keyof TEvent]
	):Promise<void> {

		const modulesStartWaiters:Promise<void>[] = [];

		for(const module of modules) {
			modulesStartWaiters.push(module.doEnter(payload));
		}

		return Promise.all(modulesStartWaiters).then();
	}

	protected activateModules(modules:HaveActivePhase[]):void {
		for(const module of modules) {
			module.activate();
		}
	}

	protected deactivateModules(modules:HaveActivePhase[]):void {
		for(const module of modules) {
			module.deactivate();
		}
	}

	protected exitModules(modules:HaveEnterPhase<TEvent>[]):Promise<void> {

		const modulesStartWaiters:Promise<void>[] = [];

		for(const module of modules) {
			modulesStartWaiters.push(module.doExit());
		}

		return Promise.all(modulesStartWaiters).then();
	}

	protected detachModules(
		scene:ISceneHost<TSceneLayersId, TSceneChildrenId>,
		modules:IModule<TEvent, TSceneLayersId, TSceneChildrenId>[]
	):void {

		for(const module of modules) {
			module.detachFromScene(scene);
		}
	}

	protected hideScene(
		scene:ISceneHost<TSceneLayersId, TSceneChildrenId>,
		scenesManager:IScenesManager<TScenesId, TSceneLayersId, TSceneChildrenId>
	):void {

		scenesManager.hide(scene);
	}

	protected destroyModules(modules:HaveDestroyPhase[]):void {

		for(const module of modules) {
			module.destroy();
		}
		modules.length = 0;
	}

}