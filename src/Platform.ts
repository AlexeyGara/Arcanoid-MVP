/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: Platform.ts
 * Path: src/
 * Author: alexeygara
 * Last modified: 2026-02-17 19:30
 */

import { WindowFrameRequester }           from "@browser/WindowFrameRequester";
import type { IAudioPlayer }              from "@core-api/audio-types";
import type { IFrameRequester }           from "@core-api/gameloop-types";
import { PixiAssetsLoader }               from "@pixi/assets/PixiAssetsLoader";
import { PixiAudioPlayer }                from "@pixi/audio/PixiAudioPlayer";
import type { IAssetsLoader }             from "@platform/engine/assets";
import type { INodesUIBuilder }           from "@platform/engine/ui";
import { WorkerFrameRequester }           from "@web/WorkerFrameRequester";
import { Application as PixiApplication } from "pixi.js";

const isBrowser = ():boolean => typeof window !== 'undefined' && typeof window.document !== 'undefined';

const DEFAULT_REQUEST_FRAME_WORKER_NAME = 'frame_request_worker.js';

export class Platform {

	static requestFrameWorkerName?:string;

	private static _audioPlayer:PixiAudioPlayer;
	private static _assetsLoader:PixiAssetsLoader;
	private static _pixiApp:PixiApplication;

	static provideAudioPlayer():IAudioPlayer {
		return Platform._audioPlayer ||= new PixiAudioPlayer();
	}

	static provideAssetsLoader():IAssetsLoader {
		return Platform._assetsLoader ||= new PixiAssetsLoader();
	}

	static provideNodeBuilder():INodesUIBuilder {

	}

	static getFrameRequester():IFrameRequester {
		if(isBrowser()) {
			return new WindowFrameRequester();
		}

		return new WorkerFrameRequester(Platform.requestFrameWorkerName || DEFAULT_REQUEST_FRAME_WORKER_NAME);
	}

	static async getRenderMethod(appViewContainer:HTMLDivElement):Promise<() => void> {
		this._pixiApp = new PixiApplication();

		await this._pixiApp.init({
									 background: "black",
									 resizeTo: window, // заменить
									 resolution: getDPR(),//for calculate pixi's screen size with dpr
									 autoDensity: true,
									 antialias: true, // опционально
									 autoStart: false,
								 });

		appViewContainer.appendChild(this._pixiApp.canvas);

		const renderCallback = ():void => this._pixiApp.renderer.render(this._pixiApp.stage);

		return renderCallback;
	}

}