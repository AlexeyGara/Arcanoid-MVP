/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Chesstles-TS
 * File: index.ts
 * Path: src/platform/browser/
 * Author: alexeygara
 * Last modified: 2026-01-29 22:45
 */

import type {
	FocusInOutForwarder,
	ResizeEventForwarder,
	ViewSizeProvider
} from "@core-api/service-types";

export const isBrowser = ():boolean => typeof window !== 'undefined' && typeof window.document !== 'undefined';

const RESIZE_DEBOUNCE_TIME = 50;
let resizeTimer:ReturnType<typeof setTimeout>;

export const focusEventsEmitter:FocusInOutForwarder = (focusInReceiver:() => void, focusOutReceiver:() => void) => {
	document.addEventListener("visibilitychange", () => {
		if(document.hidden) {
			focusOutReceiver();
		}
		else {
			focusInReceiver();
			// do not forget to 'resume()' AudioContext!
		}
	});
};

export const resizeEventEmitter:ResizeEventForwarder = (receiver:() => void) => {
	window.addEventListener('resize', () => {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(receiver, RESIZE_DEBOUNCE_TIME);
	});
};

export const viewSizeProvider:ViewSizeProvider = () => {
	return {
		x:      0,
		y:      0,
		width:  window.innerWidth,//screen.availWidth//screen.width
		height: window.innerHeight,//screen.availHeight//screen.height
		dpr:    getDPR()
	};
};

export const getDPR = ():number => window.devicePixelRatio;