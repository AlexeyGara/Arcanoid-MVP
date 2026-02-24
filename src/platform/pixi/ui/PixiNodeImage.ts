/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Chesstles-TS
 * File: PixiSprite.ts
 * Author: alexeygara
 * Last modified: 2026-01-13 23:38
 */

import type { PixiSprite }        from "@pixi/index";
import type { SceneResourceType } from "@platform/engine/resources";
import { SpriteResName }          from "@platform/engine/resources";
import { PixiNode }               from "@platform/pixi/ui/PixiNode";

export class PixiNodeImage
	extends PixiNode {

	override readonly resType:SceneResourceType = SpriteResName;

	constructor(pixiObject:PixiSprite,
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