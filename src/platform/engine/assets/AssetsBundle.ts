/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: AssetsBundle.ts
 * Path: src/platform/engine/assets/
 * Author: alexeygara
 * Last modified: 2026-01-19 14:20
 */

import type {
	AssetInvokerUid,
	IAssetsBundle,
	IAssetsLoader,
	LoadableAsset
} from "@platform/engine/assets/index";

export class AssetsBundle<TShared extends boolean = false>  implements IAssetsBundle<TShared> {

	readonly assetsOwnerUid:AssetInvokerUid;
	readonly assetsLinks:LoadableAsset<TShared extends true ? true : boolean>[];
	readonly shared:TShared;

	get loaded():boolean {
		return this._loaded;
	}

	private readonly _loader:IAssetsLoader<TShared extends true ? true : boolean>;
	private _loaded:boolean = false;
	private _loadWaiter:Promise<boolean> | null = null;
	private _unloadWaiter:Promise<void> | null = null;

	constructor(
		name:AssetInvokerUid,
		assets:LoadableAsset<TShared extends true ? true : boolean>[],
		sharedWholeBundle:TShared,
		loader:IAssetsLoader<TShared extends true ? true : boolean>
	) {
		this.assetsOwnerUid = name;
		this.assetsLinks = assets;
		this.shared = sharedWholeBundle;
		this._loader = loader;
	}

	load():Promise<boolean> {
		if(this._loaded) {
			return Promise.resolve(true);
		}

		if(this._unloadWaiter) {
			return Promise.resolve(false);
		}

		if(this._loadWaiter) {
			return this._loadWaiter;
		}

		const waiters:Promise<boolean>[] = [];
		for(const asset of this.assetsLinks) {
			if(!this._loader.isLoaded(asset.alias)) {
				waiters.push(this._loader.load(asset));
			}
		}

		this._loadWaiter = Promise.all(waiters).then(() => {
			this._loadWaiter = null;
			this._loaded = true;
			return true;
		}).catch(() => {
			this._loadWaiter = null;
			return false;
		});
		return this._loadWaiter;
	}

	unload():Promise<void> {
		if(this._loadWaiter) {
			return this._loadWaiter.then(() => {
				return this.unload();
			});
		}

		if(this._unloadWaiter) {
			return this._unloadWaiter;
		}

		if(!this._loaded) {
			return Promise.resolve();
		}

		this._loaded = false;

		const waiters:Promise<void>[] = [];
		for(const asset of this.assetsLinks) {
			if(this._loader.isLoaded(asset.alias) && !asset.shared) {
				waiters.push(this._loader.unload(asset.alias));
			}
		}

		this._unloadWaiter = Promise.all(waiters).then(() => {
			this._unloadWaiter = null;
		}).catch(() => {
			this._unloadWaiter = null;
		});
		return this._unloadWaiter;
	}
}