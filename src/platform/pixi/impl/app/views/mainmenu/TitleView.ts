/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: TitleView.ts
 * Path: src/platform/pixi/impl/app/views/mainmenu/
 * Author: alexeygara
 * Last modified: 2026-02-24 19:30
 */

import type { ResizeInfo } from "@core-api/service-types";
import { PixiViewImpl }    from "@pixi/impl/PixiViewImpl";
import type { Menu }       from "app/state/types";

export class TitleView
	extends PixiViewImpl<Menu.Title_View['id']> {

	constructor(
		releaseAsset:() => void,
	) {
		super("main-menu_title",
			  releaseAsset);
	}

	override doUpdate?(deltaTimeMs:number):void

	override doResize(resizeInfo:ResizeInfo):void {

		this.position.set(0, 0);
		this.setSize(
			resizeInfo.viewPort.width,
			resizeInfo.viewPort.height
		);
	}

}
