/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: BlastGame_MVP-Cocos
 * File: global-init.ts
 * Path: assets/Script/
 * Author: alexeygara
 * Last modified: 2026-02-08 04:26
 */

//TODO: move to env

// ---- GLOBAL VARS --->

console.info(`!!GLOBAL INITIALIZED!!`);

// @ts-expect-error it's ok
const _global:Global = (// eslint-disable-line @typescript-eslint/naming-convention
	global/* node <- "moduleResolution":"node" */
	||
	window/* browser <- "moduleResolution":"classic" */
);

_global.wait ||= function wait(timeMs:number):Promise<void> {
	return new Promise(resolve => setTimeout(resolve, timeMs));
};

_global.logger = console;

// <--- GLOBAL VARS ----
