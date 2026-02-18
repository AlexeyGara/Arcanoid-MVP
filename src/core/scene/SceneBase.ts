/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: SceneBase.ts
 * Path: src/core/scene/
 * Author: alexeygara
 * Last modified: 2026-02-18 17:44
 */

import type { IGameLoopUpdater } from "@core-api/gameloop-types";
import type { CanBeAddToScene }  from "@core-api/module-types";
import type {
	ISceneHost,
	IScenesManagerControlled
}                                from "@core-api/scene-types";
import type {
	IResizable,
	ResizeInfo
}                                from "@core-api/service-types";

// eslint-disable-next-line @typescript-eslint/naming-convention
const ESceneStatus = {
	NEW: 0,
	PRELOADING: 1,
	LOADED: 2,
	CREATED: 3,
	DESTROYED: -1
} as const;

type ESceneStatus = typeof ESceneStatus[keyof typeof ESceneStatus];

export abstract class Scene<TSceneId extends SceneIdBase,
	TSceneProps extends SceneIdPropsBase<TTargetLayerId>,
	TTargetLayerId extends SceneLayersIdBase,
	TSceneLayersId extends SceneLayersIdBase>
	implements IScenesManagerControlled<TSceneId, TSceneProps, TTargetLayerId>,
			   ISceneHost<TSceneLayersId>,
			   IResizable {

	readonly sceneId:TSceneId;
	readonly sceneProps:TSceneProps;

	get cacheable():boolean {
		return this.sceneProps.cacheable || false;
	}

	get targetLayerId():TTargetLayerId {
		return this.sceneProps.targetRootLayer;
	}

	get destroyed() {
		return this._status == ESceneStatus.DESTROYED;
	}

	private readonly _rootLayers:TSceneLayersId[];
	private readonly _rootLayersStructure:RootLayersStructure<TSceneLayersId>;
	private readonly _rootLayersAligner:INodeUIPosAligner;
	private readonly _gameLoop:IGameLoopUpdater;
	protected readonly errorEmitter:GlobalErrorEventsEmitter;
	private _status:ESceneStatus = ESceneStatus.NEW;

	protected constructor(
		sceneId:TSceneId,
		props:TSceneProps,
		sceneLayers:RootLayersStructure<TSceneLayersId>,
		gameLoop:IGameLoopUpdater,
		assetsBundles:IAssetsBundle[],
		nodeBuilder:INodesUIBuilder,
		errorThrower:GlobalErrorEventsEmitter,
		sceneLayersAligner:INodeUIPosAligner,
		root?:IHaveChildrenNodeUI & IInteractiveNodeUI
	) {
		this.onResize = this.onResize.bind(this);
		this.sceneId = sceneId;
		this.sceneProps = props;
		this._gameLoop = gameLoop;
		this.errorEmitter = errorThrower;
		this.root = root || nodeBuilder.createContainerNode(this.sceneId);
		this._rootLayersStructure = sceneLayers;
		this._rootLayers = nodeBuilder.createRootLayers(sceneLayers, this.root);
		this._rootLayersAligner = sceneLayersAligner;
		this._assetsBundles = assetsBundles;
	}

	add(view:CanBeAddToScene<TSceneLayersId>):void {
		const rootLayer = this._rootLayers.get(view.targetLayerId);
		if(!rootLayer) {
			this.errorEmitter.emitFatalErrorEvent(new Error(
				`[Scene] cannot add view to layer '${view.targetLayerId}' of scene '${this.sceneId}' because layer not found!`));
			return;
		}

		rootLayer.addChild(view.stage);
	}

	remove(view:CanBeAddToScene<TSceneLayersId>):void {
		const rootLayer = this._rootLayers.get(view.targetLayerId);
		if(!rootLayer) {
			//this._errorThrower.throwFatalErrorEvent(new Error(
			logger.warn(
				`[Scene] cannot remove view from layer '${view.targetLayerId}' of scene '${this.sceneId}' because layer not found!`
			);
			//);
			//view.stage.removeFromParent();
			return;
		}

		rootLayer.removeChild(view.stage);
	}

	addToUpdateLoop(...updatableList:IGameLoopUpdatable[]):void {
		for(const updatable of updatableList) {
			this._gameLoop.add(updatable);
		}
	}

	removeFromUpdateLoop(...updatableList:IGameLoopUpdatable[]):void {
		for(const updatable of updatableList) {
			this._gameLoop.remove(updatable);
		}
	}

	async preload():Promise<boolean> {
		if(this._status != ESceneStatus.NEW) {
			return false;
		}

		this._status = ESceneStatus.PRELOADING;

		const preloadSuccess = await this.doPreload();
		if(preloadSuccess) {
			this._status = ESceneStatus.LOADED;
			return true;
		}

		this._status = ESceneStatus.NEW;
		return false;
	}

	/** preload all required own resources, etc. before creating scene */
	protected async doPreload():Promise<boolean> {
		const waiters:Promise<boolean>[] = [];
		for(const assetsBundle of this._assetsBundles) {
			if(!assetsBundle.loaded) {
				waiters.push(assetsBundle.load(this.onPreloadProgress?.bind(this)));
			}
		}
		return Promise.all(waiters).then((success:boolean[]) => {
			return success.length == 0 || success.indexOf(false) < 0;
		});
	}

	protected onPreloadProgress?(progress:number):void;

	async create():Promise<void> {
		if(this._status == ESceneStatus.LOADED) {
			await this.doCreate();
			this._status = ESceneStatus.CREATED;
		}
	}

	/** setup scene for displaying, initial scene's first preview */
	abstract doCreate():Promise<void>;

	async destroy():Promise<void> {
		if(this._status != ESceneStatus.DESTROYED) {
			await this.doDestroy();
			this._status = ESceneStatus.DESTROYED;
		}
	}

	/** unload all own resources, etc. */
	protected async doDestroy():Promise<void> {
		for(const layer of this._rootLayers.values()) {
			this.root.removeChild(layer);
			layer.dispose();
		}
		this._rootLayers.clear();

		const waiters:Promise<void>[] = [];
		for(const assetsBundle of this._assetsBundles) {
			waiters.push(assetsBundle.unload());
		}
		return Promise.all(waiters).then();
	}

	/** enable user inputs globally for current scene, etc. */
	abstract enableInput():void;

	/** disable user inputs globally for current scene, etc. */
	abstract disableInput():void;

	onResize(resize:ResizeInfo):void {
		// resize scene's root layers
		const zeroPos:Point<number> = { x: 0, y: 0 };
		for(const layerStructure of this._rootLayersStructure) {
			const layerNode = this._rootLayers.get(layerStructure.layerId);
			if(!layerNode) {
				continue;
			}
			const layerPos = layerStructure.pos || zeroPos;
			if(!layerPos) {
				continue;
			}
			this._rootLayersAligner.alignPosition(layerNode, layerPos, resize.viewPort);
		}
	}
}
