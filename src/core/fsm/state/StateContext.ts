/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Chesstles-TS
 * File: StateContext.ts
 * Path: src/core/fsm/state/
 * Author: alexeygara
 * Last modified: 2026-01-22 19:53
 */

import type {
	IStateEnterStrategy,
	IStateExitStrategy,
	IStateStartStrategy,
	IStateStopStrategy
} from "@core-api/fsm-types";
import type {
	HaveActivePhase,
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
	TEvent extends EventBase = EventBase>
	implements IStateEnterStrategy<TEvent>,
			   IStateStartStrategy,
			   IStateStopStrategy,
			   IStateExitStrategy {

	readonly sceneId:TCustomSceneId;
	private readonly _sceneLayers:RootLayersStructure<TSceneLayersId>;
	private readonly _sceneModules:IModule<TEvent, TSceneLayersId>[];
	private readonly _sceneManager:IScenesManager<TSceneId>;
	private _scene!:ISceneHost<TSceneLayersId>;
	private readonly _enterFinishHook?:() => Promise<void>;
	private readonly _exitStartHook?:() => Promise<void>;

	constructor(
		sceneId:TCustomSceneId,
		sceneLayers:RootLayersStructure<TSceneLayersId>,
		sceneModules:IModule<TEvent, TSceneLayersId>[],
		sceneManager:IScenesManager<TSceneId>,
		enterFinishHook?:() => Promise<void>,
		exitStartHook?:() => Promise<void>
	) {
		this.sceneId = sceneId;
		this._sceneLayers = sceneLayers;
		this._sceneModules = sceneModules;
		this._sceneManager = sceneManager;
		this._enterFinishHook = enterFinishHook;
		this._exitStartHook = exitStartHook;
	}

	async doEnter(payload?:TEvent[keyof TEvent]):Promise<void> {
		this._scene = await this.showScene(this.sceneId, this._sceneLayers, this._sceneManager);

		this.attachModulesTo(this._scene, this._sceneModules);

		await this.enterModules(this._sceneModules, payload);

		await this._enterFinishHook?.();
	}

	doStart():void {
		this.activateModules(this._sceneModules);
	}

	doStop():void {
		this.deactivateModules(this._sceneModules);
	}

	async doExit():Promise<void> {
		await this._exitStartHook?.();

		await this.exitModules(this._sceneModules);

		this.detachModules(this._scene, this._sceneModules);

		this.destroyModules(this._sceneModules);

		await this.hideScene(this._scene, this._sceneManager);
	}

	protected async showScene(sceneId:TSceneId, sceneLayers:RootLayersStructure<TSceneLayersId>,
							  scenesManager:IScenesManager<TSceneId>):Promise<ISceneHost<TSceneLayersId>> {

		return await scenesManager.show(sceneId, sceneLayers);
	}

	protected attachModulesTo(scene:ISceneHost<TSceneLayersId>,
							  modules:IModule<TEvent, TSceneLayersId>[]):void {

		for(const module of modules) {
			module.attachToScene(scene);
		}
	}

	protected enterModules(modules:HaveEnterPhase<TEvent>[],
						   payload?:TEvent[keyof TEvent]):Promise<void> {

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

	protected detachModules(scene:ISceneHost<TSceneLayersId>,
							modules:IModule<TEvent, TSceneLayersId>[]):void {

		for(const module of modules) {
			module.detachFromScene(scene);
		}
	}

	protected async hideScene(scene:ISceneHost<TSceneLayersId>,
							  scenesManager:IScenesManager<TSceneId>):Promise<void> {

		await scenesManager.hide(scene);
	}

	protected destroyModules(modules:IModule<TEvent, TSceneLayersId>[]):void {

		for(const module of modules) {
			module.destroy();
		}
		modules.length = 0;
	}

}