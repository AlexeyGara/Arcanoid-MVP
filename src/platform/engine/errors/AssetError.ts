/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Chesstles-TS
 * File: AssetError.ts
 * Author: alexeygara
 * Last modified: 2026-01-18 07:37
 */

export class AssetError extends Error {

	readonly assetName:string;

	constructor(assetName:string, message?:string) {
		super(message);
		this.assetName = assetName;
	}
}