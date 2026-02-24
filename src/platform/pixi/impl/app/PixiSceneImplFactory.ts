/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: AppSceneImplFactory.ts
 * Path: src/platform/pixi/scene/app/
 * Author: alexeygara
 * Last modified: 2026-02-20 23:38
 */

import type {
	ISceneImpl,
	ISceneImplFactory
}                            from "@core-api/scene-impl-types";
import { PixiGameScene }     from "@pixi/impl/app/scenes/PixiGameScene";
import { PixiLoadingScene }  from "@pixi/impl/app/scenes/PixiLoadingScene";
import { PixiLoseScene }     from "@pixi/impl/app/scenes/PixiLoseScene";
import { PixiMainMenuScene } from "@pixi/impl/app/scenes/PixiMainMenuScene";
import { PixiPauseScene }    from "@pixi/impl/app/scenes/PixiPauseScene";
import { PixiSettingsScene } from "@pixi/impl/app/scenes/PixiSettingsScene";
import { PixiWinScene }      from "@pixi/impl/app/scenes/PixiWinScene";
import type { PixiViewImpl } from "@pixi/impl/PixiViewImpl";
import type { AssetsBundle } from "@platform/engine/assets/AssetsBundle";
import { AppSceneID }        from "app/scene/scenes";

type ViewImplProvider = <TSceneViewsId extends SceneChildIdBase>(
	sceneId:TSceneViewsId
) => PixiViewImpl<TSceneViewsId>;

export class PixiSceneImplFactory implements ISceneImplFactory<AppSceneID> {

	private readonly _viewImplProvider:ViewImplProvider;
	private readonly _assetBundlesProvider:(sceneId:AppSceneID) => AssetsBundle[];

	constructor(
		assetBundlesProvider:(sceneId:AppSceneID) => AssetsBundle[],
		viewImplProvider:ViewImplProvider,
	) {
		this._assetBundlesProvider = assetBundlesProvider;
		this._viewImplProvider     = viewImplProvider;
	}

	//createImpl(sceneId:typeof AppSceneID.MENU):PixiMainMenuScene;
	//createImpl(sceneId:typeof AppSceneID.LOADING):PixiLoadingScene;
	//createImpl(sceneId:typeof AppSceneID.GAME):PixiGameScene;
	//createImpl(sceneId:typeof AppSceneID.PAUSE):PixiPauseScene;
	//createImpl(sceneId:typeof AppSceneID.LOSE):PixiLoseScene;
	//createImpl(sceneId:typeof AppSceneID.WIN):PixiWinScene;
	//createImpl(sceneId:typeof AppSceneID.SETTINGS):PixiSettingsScene;
	createImpl(
		sceneId:AppSceneID
	):ISceneImpl<AppSceneID> {

		switch(sceneId) {
			case AppSceneID.MENU:
				return new PixiMainMenuScene(this._assetBundlesProvider(sceneId),
											 this._viewImplProvider);

			case AppSceneID.LOADING:
				return new PixiLoadingScene(this._assetBundlesProvider(sceneId),
											this._viewImplProvider);

			case AppSceneID.GAME:
				return new PixiGameScene(this._assetBundlesProvider(sceneId),
										 this._viewImplProvider);

			case AppSceneID.PAUSE:
				return new PixiPauseScene(this._assetBundlesProvider(sceneId),
										  this._viewImplProvider);

			case AppSceneID.LOSE:
				return new PixiLoseScene(this._assetBundlesProvider(sceneId),
										 this._viewImplProvider);

			case AppSceneID.WIN:
				return new PixiWinScene(this._assetBundlesProvider(sceneId),
										this._viewImplProvider);

			case AppSceneID.SETTINGS:
				return new PixiSettingsScene(this._assetBundlesProvider(sceneId),
											 this._viewImplProvider);

			default:
				assertNever(sceneId);
		}
	}
}