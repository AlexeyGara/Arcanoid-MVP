/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Chesstles-TS
 * File: PixiAnimation.ts
 * Author: alexeygara
 * Last modified: 2026-01-13 23:39
 */

import type { PixiAnimatedSprite } from "@pixi/index";
import type { SceneResourceType }  from "@platform/engine/resources";
import { MovieResName }            from "@platform/engine/resources";
import { PixiNode }                from "@platform/pixi/ui/PixiNode";

export class PixiNodeAnimation
	extends PixiNode {

	override readonly resType:SceneResourceType = MovieResName;

	constructor(pixiObject:PixiAnimatedSprite,
				releaseAsset:() => void,
				originSizeGetters:{ getWidth():number; getHeight():number },
				id?:string,
	) {
		super(
			pixiObject,
			releaseAsset,
			id,
			originSizeGetters
		);
	}
}