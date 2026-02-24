/*
 * Copyright (c) Alexey Gara 2025.
 * "Chesstles-TS" project
 * Current file: "PixiAssetsLoader.ts"
 * Last modified date: 28.12.2025, 08:09
 * All rights reserved.
 */

import { PixiAssets } from "@pixi/index";
import type {
	AssetUniqueAlias,
	IAssetsLoader,
	LoadableAsset
}                     from "@platform/engine/assets";

export class PixiAssetsLoader implements IAssetsLoader {

	isLoaded(assetUid:AssetUniqueAlias):boolean {
		return PixiAssets.cache.has(Symbol.keyFor(assetUid)!);
	}

	async load(asset:LoadableAsset):Promise<boolean> {
		try {
			const result = await PixiAssets.load({
													 alias: Symbol.keyFor(asset.alias),
													 src:   asset.source
												 });
			if(result) {
				return true;
			}
		}
		catch(error) {
			logger.warn(
				`Cannot load or parse asset '${Symbol.keyFor(
					asset.alias)}' from '${asset.source}' by reason: [${error}]`);
			return false;
		}
		return true;
	}

	async unload(assetUid:AssetUniqueAlias):Promise<void> {
		await PixiAssets.unload(Symbol.keyFor(assetUid)!);
	}
}