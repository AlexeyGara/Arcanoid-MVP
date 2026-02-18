/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Chesstles-TS
 * File: PixiText.ts
 * Author: alexeygara
 * Last modified: 2026-01-13 23:39
 */

import type { SceneResourceType } from "@platform/engine/resources";
import { TextResName }            from "@platform/engine/resources";
import { PixiNode }               from "@platform/pixi/ui/PixiNode";
import type {
	BitmapText as PixiBitmapText,
	Text as PixiText
}                                 from "pixi.js";

export class PixiNodeText
	extends PixiNode {

	override readonly resType:SceneResourceType = TextResName;

	constructor(pixiObject:PixiText | PixiBitmapText,
				releaseAsset:() => void,
				id?:string,
				originSizeGetters?:{ getWidth():number; getHeight():number },
	) {
		super(
			pixiObject,
			releaseAsset,
			id,
			originSizeGetters
		);
	}
}