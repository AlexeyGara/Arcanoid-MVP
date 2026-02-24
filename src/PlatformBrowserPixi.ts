/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: Platform.ts
 * Path: src/
 * Author: alexeygara
 * Last modified: 2026-02-17 19:30
 */

import {
	getDPR,
	isBrowser
}                                from "@browser/index";
import { WindowFrameRequester }  from "@browser/WindowFrameRequester";
import type { IAudioPlayer }     from "@core-api/audio-types";
import type { IFrameRequester }  from "@core-api/gameloop-types";
import type { IViewsHolderImpl } from "@core-api/scene-impl-types";
import { PixiAssetsLoader }      from "@pixi/assets/PixiAssetsLoader";
import { PixiAudioPlayer }       from "@pixi/audio/PixiAudioPlayer";
import type { PixiContainer }    from "@pixi/index";
import { PixiApplication }    from "@pixi/index";
import { PixiRootStageImpl }  from "@pixi/impl/PixiRootStageImpl";
import type { IAssetsLoader } from "@platform/engine/assets";
import { WorkerFrameRequester }  from "@web/WorkerFrameRequester";
import type {
	AppRootLayersId,
	AppSceneID
}                                from "app/scene/scenes";

const DEFAULT_REQUEST_FRAME_WORKER_NAME = 'frame_request_worker.js';

export class PlatformBrowserPixi {

	static requestFrameWorkerName?:string;

	private static _audioPlayer:PixiAudioPlayer;
	private static _assetsLoader:PixiAssetsLoader;
	private static _pixiApp:PixiApplication;

	static provideAudioPlayer():IAudioPlayer {
		return PlatformBrowserPixi._audioPlayer ||= new PixiAudioPlayer();
	}

	static provideAssetsLoader():IAssetsLoader {
		return PlatformBrowserPixi._assetsLoader ||= new PixiAssetsLoader();
	}

	static getFrameRequester():IFrameRequester {
		if(isBrowser()) {
			return new WindowFrameRequester();
		}

		return new WorkerFrameRequester(PlatformBrowserPixi.requestFrameWorkerName
										|| DEFAULT_REQUEST_FRAME_WORKER_NAME);
	}

	static async getRenderMethod(appViewContainer:HTMLDivElement, useDPR:boolean):Promise<() => void> {
		this._pixiApp = new PixiApplication();

		await this._pixiApp.init({
									 background:  "black",
									 resizeTo:    window, // заменить
									 resolution:  useDPR ? getDPR() : 1,//for calculate pixi's screen size with dpr
									 autoDensity: true,
									 antialias:   true, // опционально
									 autoStart:   false,
								 });

		appViewContainer.appendChild(this._pixiApp.canvas);

		// render callback:
		return ():void => this._pixiApp.renderer.render(this._pixiApp.stage);
	}

	static getPixiAppCanvas():HTMLCanvasElement {
		return this._pixiApp.canvas;
	}

	static getPixiAppRoot():PixiContainer {
		return this._pixiApp.stage;
	}

	static provideRootStageImpl():IViewsHolderImpl<AppRootLayersId, AppSceneID> {
		return new PixiRootStageImpl(PlatformBrowserPixi.getPixiAppRoot(),
									 null);
	}

}