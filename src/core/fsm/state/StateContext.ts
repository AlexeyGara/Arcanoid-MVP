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
} from "@core-api/fsm-types";
import type {
	HaveActivePhase,
	HaveDestroyPhase,
	HaveEnterPhase,
	IModule
} from "@core-api/module-types";
import type {
	ISceneHost,
	IScenesManager
} from "@core-api/scene-types";

export class StateContext<TSceneId extends SceneIdBase = SceneIdBase,
	TCustomSceneId extends TSceneId = TSceneId,
	TSceneLayersId extends SceneLayersIdBase = SceneLayersIdBase,
	TSceneChildrenId extends SceneChildIdBase = SceneChildIdBase,
	TEvent extends EventBase = EventBase>

	implements IStateAttachStrategy,
			   IStateEnterStrategy<TEvent>,
			   IStateStartStrategy {

	@final
	readonly sceneId:TCustomSceneId;

	private readonly _sceneModules:IModule<TEvent, TSceneLayersId, TSceneChildrenId>[];
	private readonly _sceneManager:IScenesManager<TSceneId, TSceneLayersId, TSceneChildrenId>;
	private _scene!:ISceneHost<TSceneLayersId, TSceneChildrenId>;
	private readonly _enterFinishHook?:() => Promise<void>;
	private readonly _exitStartHook?:() => Promise<void>;

	constructor(
		sceneId:TCustomSceneId,
		sceneModules:IModule<TEvent, TSceneLayersId, TSceneChildrenId>[],
		sceneManager:IScenesManager<TSceneId, TSceneLayersId, TSceneChildrenId>,
		enterFinishHook?:() => Promise<void>,
		exitStartHook?:() => Promise<void>
	) {
		this.sceneId          = sceneId;
		this._sceneModules    = sceneModules;
		this._sceneManager    = sceneManager;
		this._enterFinishHook = enterFinishHook;
		this._exitStartHook   = exitStartHook;
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
		this.detachModules(this._scene, this._sceneModules);
		this.destroyModules(this._sceneModules);
		this.hideScene(this._scene, this._sceneManager);
	}

	protected async showScene(
		sceneId:TSceneId,
		scenesManager:IScenesManager<TSceneId, TSceneLayersId, TSceneChildrenId>
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
		scenesManager:IScenesManager<TSceneId, TSceneLayersId, TSceneChildrenId>
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