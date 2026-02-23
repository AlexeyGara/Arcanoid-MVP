/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: BackgroundView.ts
 * Path: src/platform/pixi/scene/app/scenes/mainmenu/views/
 * Author: alexeygara
 * Last modified: 2026-02-23 17:43
 */

import type { ResizeInfo }      from "@core-api/service-types";
import { PixiViewImpl }         from "@pixi/scene/PixiViewImpl";
import type { Background_View } from "app/state/main-menu-state-connecting-types";

type ViewID = Background_View['id'];

export class BackgroundView extends PixiViewImpl<ViewID> {

	constructor(
		releaseAsset:() => void,
	) {
		super("main-menu_background",
			  releaseAsset);
	}

	override doUpdate?(deltaTimeMs:number):void

	override doResize(resizeInfo:ResizeInfo):void {

		//TODO: implement resize

		logger.log(resizeInfo + "");
	}

}