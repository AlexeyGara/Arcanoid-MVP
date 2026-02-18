/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: AssetsManager.ts
 * Path: src/platform/engine/assets/
 * Author: alexeygara
 * Last modified: 2026-01-19 14:20
 */

import type {
	AssetData,
	AssetInvokerUid,
	AssetSourcePathResolver,
	AssetType,
	AssetUniqueAlias,
	IAssetsBundle,
	IAssetsBundleFactory,
	IAssetsLoader,
	IAssetsManager,
	LoadableAsset
}                             from "@platform/engine/assets/index";
import {
	isAnimationAssetGuard,
	isAudioAssetGuard,
	isBinaryAssetGuard,
	isBitmapFontAssetGuard,
	isFontAssetGuard,
	isJsonAssetGuard,
	isTextAssetGuard,
	isTextureAssetGuard,
	isVideoAssetGuard
}                             from "@platform/engine/assets/index";
import { UidService }         from "@platform/engine/assets/UidService";
import { AssetError }         from "@platform/engine/errors/AssetError";
import { AssetNotFoundError } from "@platform/engine/errors/AssetNotFoundError";

export class AssetsManager<TSceneId extends SceneIdBase> implements IAssetsManager<TSceneId> {

	private readonly _bundlesFactory:IAssetsBundleFactory<TSceneId>;
	private readonly _allBundles:Map<TSceneId, IAssetsBundle<boolean>[]> = new Map();
	private readonly _allAssets:Map<AssetUniqueAlias, AssetData> = new Map();
	private readonly _assetsLoaderProvider:() => IAssetsLoader;
	private readonly _assetsRefCounter:Map<AssetUniqueAlias, Set<AssetInvokerUid>> = new Map();
	private readonly _assetsTypeResolver:AssetSourcePathResolver;

	constructor(
		assetsBundleFactory:IAssetsBundleFactory<TSceneId>,
		assetsLoaderProvider:() => IAssetsLoader,
		assetsTypeResolver:AssetSourcePathResolver
	) {
		this._bundlesFactory = assetsBundleFactory;
		this._assetsLoaderProvider = assetsLoaderProvider;
		this._assetsTypeResolver = assetsTypeResolver;
	}

	getAssetsBundles<TShared extends boolean>(
		sceneId:TSceneId
	):IAssetsBundle<TShared>[] {
		let bundles = this._allBundles.get(sceneId);
		if(bundles) {
			return bundles as IAssetsBundle<TShared>[];
		}
		bundles = this._bundlesFactory.createAssetsBundles(
			sceneId,
			this._assetsLoaderProvider(),
			this._assetsTypeResolver,
			this
		);
		this._allBundles.set(sceneId, bundles);
		return bundles as IAssetsBundle<TShared>[];
	}

	registerAsset(assetData:AssetData):void {
		const assetAlias = UidService.getUniqueAssetAlias(assetData.alias);
		if(this._allAssets.has(assetAlias)) {
			if(this._allAssets.get(assetAlias)!.name != assetData.name) {
				throw new AssetError(assetData.name, `Double register asset at '${assetData.alias}' slot!`);
			}
			return;
		}
		this._allAssets.set(assetAlias, assetData);
	}

	getAsset<TAssetType extends AssetType, T extends boolean>(
		assetAlias:AssetUniqueAlias,
		assetType:TAssetType,
		assetInvoker:AssetInvokerUid,
		throwErrorIfNotFound?:T
	):T extends true ? AssetData<TAssetType> : AssetData<TAssetType> | null {
		const asset = this._getAsset(assetAlias, assetType);
		if(asset) {
			let refCounter = this._assetsRefCounter.get(assetAlias);

			if(!refCounter) {
				refCounter = new Set();
				this._assetsRefCounter.set(assetAlias, refCounter);
			}

			refCounter.add(assetInvoker);

			return asset;
		}

		if(throwErrorIfNotFound) {
			throw new AssetNotFoundError(assetAlias, assetType, assetInvoker,
										 `Cannot found asset by alias '${String(assetAlias)}'!`);
		}

		return null as T extends true ? AssetData<TAssetType> : AssetData<TAssetType> | null;
	}

	releaseAsset(
		assetAlias:AssetUniqueAlias,
		assetOwner:AssetInvokerUid
	):void {
		if(!this._hasAsset(assetAlias)) {
			return;
		}

		const refCounter = this._assetsRefCounter.get(assetAlias);
		if(refCounter) {
			refCounter.delete(assetOwner);

			if(refCounter.size == 0) {
				const assetInfo = this._getAssetInfo(assetAlias);
				this._assetsRefCounter.delete(assetAlias);
				if(!assetInfo?.shared) {
					void this._assetsLoaderProvider().unload(assetAlias);
				}
			}
		}
	}

	private _getAsset<TAssetType extends AssetType>(assetUid:AssetUniqueAlias,
													assetType:TAssetType):AssetData<TAssetType> | null {
		const asset = this._allAssets.get(assetUid);
		if(asset) {
			if(
				(assetType == "image" && !isTextureAssetGuard(asset)) ||
				(assetType == "animation" && !isAnimationAssetGuard(asset)) ||
				(assetType == "video" && !isVideoAssetGuard(asset)) ||
				(assetType == "text" && !isTextAssetGuard(asset)) ||
				(assetType == "font" && !isFontAssetGuard(asset)) ||
				(assetType == "bitmap-font" && !isBitmapFontAssetGuard(asset)) ||
				(assetType == "audio" && !isAudioAssetGuard(asset)) ||
				(assetType == "json-object" && !isJsonAssetGuard(asset)) ||
				(assetType == "binary" && !isBinaryAssetGuard(asset))
			) {
				return null;
			}
			else if(assetType != "image" &&
					assetType != "animation" &&
					assetType != "video" &&
					assetType != "text" &&
					assetType != "font" &&
					assetType != "bitmap-font" &&
					assetType != "audio" &&
					assetType != "json-object" &&
					assetType != "binary") {
				assertNever(assetType);
			}
			return asset as AssetData<TAssetType>;
		}
		return null;
	}

	private _hasAsset(assetUid:AssetUniqueAlias):boolean {
		return this._allAssets.has(assetUid);
	}

	private _getAssetInfo(assetUid:AssetUniqueAlias):LoadableAsset<boolean> | null {
		for(const sceneBundles of this._allBundles.values()) {
			for(const bundle of sceneBundles) {
				for(const asset of bundle.assetsLinks) {
					if(asset.alias === assetUid) {
						return asset;
					}
				}
			}
		}
		return null;
	}

}