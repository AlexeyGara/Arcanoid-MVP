/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: PixiAssetsBundleFactory.ts
 * Path: src/platform/pixi/impl/app/
 * Author: alexeygara
 * Last modified: 2026-02-24 19:58
 */

import * as commonItemsAssetsJson from "@impl-pixi/assets/common-items-assets.json";
import * as commonMusicAssetsJson from "@impl-pixi/assets/common-music-assets.json";
import * as gameAssetsJson        from "@impl-pixi/assets/game-assets.json";
import * as loadingAssetsJson     from "@impl-pixi/assets/loading-assets.json";
import * as menuAssetsJson        from "@impl-pixi/assets/menu-assets.json";
import * as winAssetsJson         from "@impl-pixi/assets/win-assets.json";
import type {
	AssetData,
	AssetDataRegister,
	AssetInvokerUid,
	AssetSourcePathResolver,
	AssetUniqueAlias,
	IAssetsBundle,
	IAssetsBundleFactory,
	IAssetsLoader,
	LoadableAsset
}                                 from "@platform/engine/assets";
import { AssetsBundle }           from "@platform/engine/assets/AssetsBundle";
import { UidService }             from "@platform/engine/assets/UidService";
import type { AppSceneID }        from "app/scene/scenes";

type AssetsJSON = typeof menuAssetsJson;

const COMMON_ASSETS_ID = ["common-items",
						  "common-music"] as const;

type CommonAssetsId = typeof COMMON_ASSETS_ID[number];

type AssetsBundleIdKey = AppSceneID | CommonAssetsId;

type AppSceneNameUnique = `app-${AssetsBundleIdKey}`;

type AssetsAliasUniqueIdKey = `${AppSceneNameUnique}-${string}`;

export class PixiAssetsBundleFactory

	implements IAssetsBundleFactory<AppSceneID> {

	/** Map for asset invokers unique IDs: 'invoker_unique_ID_string' -> Symbol.for('invoker_unique_ID_string') */
	private _allBundlesUniqueIDs:Map<AssetsBundleIdKey, AssetInvokerUid>          = new Map();
	/** Map for assets unique IDs: 'unique_ID_string' -> Symbol.for('unique_ID_string') */
	private _allAssetsUniqueAliases:Map<AssetsAliasUniqueIdKey, AssetUniqueAlias> = new Map();

	constructor() {
		this._fillScenesUniqueIDs();
		this._fillAssetsUniqueAliases();
	}

	private _getAssetsJSON(sceneId:AssetsBundleIdKey):AssetsJSON {
		switch(sceneId) {
			case "MENU":
				return menuAssetsJson;
			case "LOADING":
				return loadingAssetsJson;
			case "GAME":
				return gameAssetsJson;
			case "PAUSE":
				return pauseAssetsJson;
			case "WIN":
				return winAssetsJson;
			case "LOSE":
				return loseAssetsJson;
			case "SETTINGS":
				return settingsAssetsJson;
			case "common-items":
				return commonItemsAssetsJson;
			case "common-music":
				return commonMusicAssetsJson;
			default:
				assertNever(sceneId);
		}
	}

	/** Generate unique IDs for assets invokers */
	private _fillScenesUniqueIDs():void {
		const sceneNames:AppSceneID[]               = Object.values(AppScenesIDs);
		const sceneUniqueNames:AppSceneNameUnique[] = sceneNames.map<AppSceneNameUnique>(
			(sceneName:AppSceneID) => `app-${sceneName}`
		);

		const totalNames       = [...sceneNames, ...COMMON_ASSETS_ID];
		const totalUniqueNames = [...sceneUniqueNames, ...COMMON_ASSETS_ID];

		for(const index in totalNames) {
			const name       = totalNames[index];
			const nameUnique = totalUniqueNames[index];
			this._allBundlesUniqueIDs.set(
				name,
				UidService.tryGetUniqueAssetOwner(
					nameUnique,
					true
				) as AssetInvokerUid
			);
		}
	}

	/** Generate unique IDs for each asset item of cross all bundles */
	private _fillAssetsUniqueAliases():void {
		for(const bundleIdKey of this._allBundlesUniqueIDs.keys()) {
			const assetsJson = this._getAssetsJSON(bundleIdKey);
			for(const assetJson of assetsJson) {
				const assetAliasUnique:AssetsAliasUniqueIdKey = `app-${bundleIdKey}-${assetJson.name}`;
				assetJson.alias                               = assetAliasUnique;
				this._allAssetsUniqueAliases.set(
					assetAliasUnique,
					UidService.tryGetUniqueAssetAlias(
						assetAliasUnique,
						true
					) as AssetUniqueAlias
				);
			}
		}
	}

	createAssetsBundles(
		sceneId:AppSceneID,
		assetsLoader:IAssetsLoader<boolean>,
		srcPathResolver:AssetSourcePathResolver,
		assetDataRegister:AssetDataRegister
	):IAssetsBundle<boolean>[] {
		switch(sceneId) {
			case "MENU":
				return [
					// MENU screen assets
					new AssetsBundle(
						this._allBundlesUniqueIDs.get(sceneId)!,
						this.getBundleAssets(sceneId, srcPathResolver, assetDataRegister),
						false,
						assetsLoader
					)
				];
			case "BONUS":
				return [
					// common bundle with items
					this.createCommonItemsBundle(assetsLoader, srcPathResolver, assetDataRegister),
					// BONUS screen assets
					new AssetsBundle(
						this._allBundlesUniqueIDs.get(sceneId)!,
						this.getBundleAssets(sceneId, srcPathResolver, assetDataRegister),
						false,
						assetsLoader
					)
				];
			case "LOADING":
				return [
					// LOADING screen assets
					new AssetsBundle(
						this._allBundlesUniqueIDs.get(sceneId)!,
						this.getBundleAssets(sceneId, srcPathResolver, assetDataRegister),
						false,
						assetsLoader
					)
				];
			case "MAP":
				return [
					// MAP screen assets
					new AssetsBundle(
						this._allBundlesUniqueIDs.get(sceneId)!,
						this.getBundleAssets(sceneId, srcPathResolver, assetDataRegister),
						false,
						assetsLoader
					)
				];
			case "GAME":
				return [
					// common bundle with items
					this.createCommonItemsBundle(assetsLoader, srcPathResolver, assetDataRegister),
					// GAME screen assets
					new AssetsBundle(
						this._allBundlesUniqueIDs.get(sceneId)!,
						this.getBundleAssets(sceneId, srcPathResolver, assetDataRegister),
						false,
						assetsLoader
					)
				];
			case "WIN":
				return [
					// common bundle with items
					this.createCommonItemsBundle(assetsLoader, srcPathResolver, assetDataRegister),
					// WIN screen assets
					new AssetsBundle(
						this._allBundlesUniqueIDs.get(sceneId)!,
						this.getBundleAssets(sceneId, srcPathResolver, assetDataRegister),
						false,
						assetsLoader
					)
				];
			default:
				assertNever(sceneId);
		}
	}

	/** Create an assets bundle with common music, etc. */
	createCommonMusicBundle(
		loader:IAssetsLoader<true>,
		srcPathResolver:AssetSourcePathResolver,
		assetDataRegister:AssetDataRegister
	):IAssetsBundle<true> {
		return new AssetsBundle(
			this._allBundlesUniqueIDs.get('common-music')!,
			this.getBundleAssets('common-music', srcPathResolver, assetDataRegister, true),
			true,
			loader
		);
	}

	/** Create an assets bundle with items icons (for inventory, bonus and win screens, etc.), pickup sounds, etc. */
	private createCommonItemsBundle(
		loader:IAssetsLoader<true>,
		srcPathResolver:AssetSourcePathResolver,
		assetDataRegister:AssetDataRegister
	):IAssetsBundle<true> {
		return new AssetsBundle(
			this._allBundlesUniqueIDs.get('common-items')!,
			this.getBundleAssets('common-items', srcPathResolver, assetDataRegister, true),
			true,
			loader
		);
	}

	private getBundleAssets<T extends boolean>(
		bundleId:AssetsBundleIdKey,
		srcPathResolver:AssetSourcePathResolver,
		assetDataRegister:AssetDataRegister,
		shared?:T
	):LoadableAsset<T extends true ? true : boolean>[] {
		const assetsJson = this._getAssetsJSON(bundleId);
		return this.createAssetsInfos(assetsJson, srcPathResolver, assetDataRegister, shared);
	}

	private createAssetsInfos<T extends boolean>(
		assetsJson:AssetsJSON,
		srcPathResolver:AssetSourcePathResolver,
		assetDataRegister:AssetDataRegister,
		shared?:T
	):LoadableAsset<T extends true ? true : boolean>[] {
		const result:LoadableAsset<T extends true ? true : boolean>[] = [];
		for(const entry of assetsJson) {
			assetDataRegister.registerAsset(entry);
			result.push({
							alias: this._allAssetsUniqueAliases.get(entry.alias as AssetsAliasUniqueIdKey)!,
							...srcPathResolver(entry as AssetData),
							shared: (shared ? true : !!entry.shared) as T extends true ? true : boolean
						});
		}
		return result;
	}

}