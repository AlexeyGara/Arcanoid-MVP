/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: AppScenesFactory.ts
 * Path: src/app/scene/
 * Author: alexeygara
 * Last modified: 2026-02-22 00:43
 */

import type { ISceneImpl }      from "@core-api/scene-impl-types";
import type {
	IScenesFactory,
	SceneObject
}                               from "@core-api/scene-types";
import type { AppRootLayersId } from "app/scene/scenes";
import { AppSceneID }   from "app/scene/scenes";
import { GameScene }    from "app/structure/scenes/GameScene";
import { LoadingScene } from "app/structure/scenes/LoadingScene";
import { LoseScene }    from "app/structure/scenes/LoseScene";
import { MainMenuScene } from "app/structure/scenes/MainMenuScene";
import { PauseScene }    from "app/structure/scenes/PauseScene";
import { SettingsScene } from "app/structure/scenes/SettingsScene";
import { WinScene }      from "app/structure/scenes/WinScene";
import type { GameLoop } from "core/gameloop/GameLoop";

type SceneImplProvider = <TSceneId extends AppSceneID,
	TSceneLayersId extends SceneLayersIdBase,
	TSceneViewsId extends SceneChildIdBase>(
	sceneId:TSceneId
) => ISceneImpl<TSceneId, TSceneLayersId, TSceneViewsId>;

export class AppScenesFactory

	implements IScenesFactory<AppSceneID, AppRootLayersId> {

	private readonly _gameLoop:GameLoop;
	private readonly _sceneImplProvider:SceneImplProvider;

	constructor(
		gameLoop:GameLoop,
		sceneImplProvider:SceneImplProvider,
	) {
		this._sceneImplProvider = sceneImplProvider;
		this._gameLoop          = gameLoop;
	}

	createScene(sceneId:typeof AppSceneID.MENU):MainMenuScene;
	createScene(sceneId:typeof AppSceneID.LOADING):LoadingScene;
	createScene(sceneId:typeof AppSceneID.GAME):GameScene;
	createScene(sceneId:typeof AppSceneID.PAUSE):PauseScene;
	createScene(sceneId:typeof AppSceneID.LOSE):LoseScene;
	createScene(sceneId:typeof AppSceneID.WIN):WinScene;
	createScene(sceneId:typeof AppSceneID.SETTINGS):SettingsScene;
	createScene(
		sceneId:AppSceneID
	):SceneObject<AppSceneID, SceneIdPropsBase<AppRootLayersId>, AppRootLayersId, SceneLayersIdBase, SceneChildIdBase> {

		switch(sceneId) {
			case AppSceneID.MENU:
				return new MainMenuScene(this._gameLoop,
										 this._sceneImplProvider(sceneId));

			case AppSceneID.LOADING:
				return new LoadingScene(this._gameLoop,
										this._sceneImplProvider(sceneId));

			case AppSceneID.GAME:
				return new GameScene(this._gameLoop,
									 this._sceneImplProvider(sceneId));

			case AppSceneID.PAUSE:
				return new PauseScene(this._gameLoop,
									  this._sceneImplProvider(sceneId));

			case AppSceneID.LOSE:
				return new LoseScene(this._gameLoop,
									 this._sceneImplProvider(sceneId));

			case AppSceneID.WIN:
				return new WinScene(this._gameLoop,
									this._sceneImplProvider(sceneId));

			case AppSceneID.SETTINGS:
				return new SettingsScene(this._gameLoop,
										 this._sceneImplProvider(sceneId));

			default:
				assertNever(sceneId);
		}
	}
}