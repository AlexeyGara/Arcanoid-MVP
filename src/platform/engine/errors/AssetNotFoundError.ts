/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: AssetNotFoundError.ts
 * Path: src/platform/engine/errors/
 * Author: alexeygara
 * Last modified: 2026-02-17 22:22
 */

import type {
	AssetInvokerUid,
	AssetType,
	AssetUniqueAlias
}                     from "@platform/engine/assets";
import { AssetError } from "@platform/engine/errors/AssetError";

export class AssetNotFoundError extends AssetError {

	readonly assetAlias:AssetUniqueAlias;
	readonly assetType:AssetType;
	readonly assetOwner:AssetInvokerUid;

	constructor(assetAlias:AssetUniqueAlias, assetType:AssetType, assetOwner:AssetInvokerUid, message?:string) {
		super(String(Symbol.keyFor(assetAlias)), message);
		this.assetType = assetType;
		this.assetOwner = assetOwner;
		this.assetAlias = assetAlias;
	}
}