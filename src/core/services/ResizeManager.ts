/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Chesstles-TS
 * File: ResizeManager.ts
 * Author: alexeygara
 * Last modified: 2026-01-05 12:58
 */

import type {
	IResizable,
	IResizeManager,
	ResizeEventForwarder,
	ResizeInfo,
	ViewSizeProvider
} from "@core-api/service-types";

export class ResizeManager implements IResizeManager {

	private _justAdded:Set<IResizable> = new Set();
	private _listeners:Set<IResizable> = new Set();
	private _originAssetsSize:Size<uintMoreZero>;
	private readonly _viewSizeProvider:ViewSizeProvider;
	private readonly _lastResizeInfo:Writeable<ResizeInfo> = {
		viewPort: {
			x: 0, y: 0,
			width: 0, height: 0,
			dpr: 1
		},
		scale: 1
	};
	private _justAddedUpdater:Promise<void> | undefined;

	constructor(
		originAssetsSize:Size<uintMoreZero>,
		viewSizeProvider:ViewSizeProvider,
		resizeEventForwarder:ResizeEventForwarder
	) {
		this._originAssetsSize = originAssetsSize;
		this._viewSizeProvider = viewSizeProvider;

		this._updateResizeInfo();

		resizeEventForwarder(() => {
			this._updateResizeInfo();
			const listeners = [...this._listeners];
			this._dispatchResize(listeners);
		});
	}

	addListener(listener:IResizable):void {
		this._justAdded.add(listener);
		this._listeners.add(listener);

		if(!this._justAddedUpdater) {
			this._justAddedUpdater = Promise.resolve().then(() => {
				delete this._justAddedUpdater;
				const listeners = [...this._justAdded];
				this._justAdded.clear();
				this._dispatchResize(listeners);
			});
		}
	}

	removeListener(listener:IResizable):void {
		this._listeners.delete(listener);
		this._justAdded.delete(listener);
	}

	private _dispatchResize(listeners:IResizable[]):void {
		for(const listener of [...listeners]) {
			listener.onResize?.(this._lastResizeInfo);
		}
	}

	private _updateResizeInfo():void {
		this._lastResizeInfo.viewPort = { ...this._viewSizeProvider() };
		this._lastResizeInfo.scale = Math.min(
			this._lastResizeInfo.viewPort.width / this._originAssetsSize.width,
			this._lastResizeInfo.viewPort.height / this._originAssetsSize.height
		);
	}
}