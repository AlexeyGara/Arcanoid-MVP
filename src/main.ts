/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: main.ts
 * Path: src/
 * Author: alexeygara
 * Last modified: 2026-02-16 18:44
 */

import "@_global-init_";
import { focusEventsEmitter, resizeEventEmitter, viewSizeProvider } from "@browser/index";
import { Bootstrap } from "./Bootstrap";

const ORIGIN_ASSETS_SIZE 	= {
	width: 800 as uintMoreZero,
	height: 600 as uintMoreZero
};

const appContainer = document.getElementById("pixi-container") as HTMLDivElement;

void (async ():Promise<void> => {

	const bootstrap = new Bootstrap(
		ORIGIN_ASSETS_SIZE,
		appContainer,
		focusEventsEmitter,
		resizeEventEmitter,
		viewSizeProvider
	);

	await bootstrap.start();

})();
