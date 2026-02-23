/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: MainMenuView.ts
 * Path: src/app/structure/mainmenu/module/views/
 * Author: alexeygara
 * Last modified: 2026-02-23 16:28
 */

import type { IAnimationPlayer }     from "@core-api/animation-types";
import type { GameTime }             from "@core-api/gameloop-types";
import type { LightWeightModelBase } from "@core-api/module-types";
import type { IViewImpl }            from "@core-api/view-impl-types";
import type { Background_View }      from "app/state/main-menu-state-connecting-types";
import { ViewBase }                  from "core/module/ViewBase";

type TargetLayerID = Background_View['targetLayerId'];
type ViewID = Background_View['id'];

export class BackgroundView
	extends ViewBase<TargetLayerID, ViewID> {

	readonly uniqueOwnId = "main-menu_background";

	readonly targetLayerId = "background";

	readonly destroyed:boolean = false;
	readonly fullyImplDispose:boolean = true;

	constructor(
		viewImplProvider:(viewId:ViewID) => IViewImpl<ViewID>,
	) {
		super(viewImplProvider);
	}

	/*
	override onBeforeAttach():void {
		super.onBeforeAttach();

	}
	*/

	override onAttached?(animationPlayer:IAnimationPlayer):void;

	onModelUpdated?(model:DeepReadonly<LightWeightModelBase>):void

	onDetached?():void;

	override doUpdate?(time:GameTime):void;

	override doDestroy?():void;

}