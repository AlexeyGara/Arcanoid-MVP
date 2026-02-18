/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Chesstles-TS
 * File: UidService.ts
 * Author: alexeygara
 * Last modified: 2026-01-08 23:06
 */

import type {
	AssetInvokerUid,
	AssetUniqueAlias
} from "./index";

export class UidService {

	private static _assetsKeys:Set<symbol> = new Set();
	private static _invokersKeys:Set<symbol> = new Set();

	static getUniqueAssetAlias(assetAlias:string):AssetUniqueAlias {
		const uidRef = Symbol.for(assetAlias);

		if(UidService._assetsKeys.has(uidRef)) {
			return uidRef;
		}

		throw new Error(`Asset alias '${assetAlias}' is not created before get!`);
	}

	static getUniqueAssetOwner(assetInvokerId:string):AssetInvokerUid {
		const uidRef = Symbol.for(assetInvokerId);

		if(UidService._invokersKeys.has(uidRef)) {
			return uidRef;
		}

		throw new Error(`Asset owner uid '${assetInvokerId}' is not created before get!`);
	}

	static tryGetUniqueAssetAlias<T extends boolean>(
		assetAlias:string,
		throwErrorIfUsed?:T
	):T extends true ? AssetUniqueAlias : AssetUniqueAlias | false {
		const res = UidService._uidCreateAndCheck(assetAlias, UidService._assetsKeys);
		if(res) {
			return res;
		}

		if(throwErrorIfUsed) {
			throw new Error(`Asset alias '${assetAlias}' is used already!`);
		}

		return false as T extends true ? AssetUniqueAlias : AssetUniqueAlias | false;
	}

	static tryGetUniqueAssetOwner<T extends boolean>(
		assetInvokerId:string,
		throwErrorIfUsed?:T
	):T extends true ? AssetInvokerUid : AssetInvokerUid | false {
		const res = UidService._uidCreateAndCheck(assetInvokerId, UidService._invokersKeys);
		if(res) {
			return res;
		}

		if(throwErrorIfUsed) {
			throw new Error(`Asset owner uid '${assetInvokerId}' is used already!`);
		}

		return false as T extends true ? AssetInvokerUid : AssetInvokerUid | false;
	}

	/*
	static getUidRef(anyNotUniqueName:string):symbol {
		return Symbol(anyNotUniqueName);
	}
	*/

	private static _uidCreateAndCheck(uid:string, map:Set<symbol>):symbol | false {
		const uidRef = Symbol.for(uid);

		if(map.has(uidRef)) {
			return false;
		}

		map.add(uidRef);
		return uidRef;
	}
}