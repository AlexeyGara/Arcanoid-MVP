/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: utils.ts
 * Path: src/platform/pixi/
 * Author: alexeygara
 * Last modified: 2026-02-23 17:54
 */

import type { PixiContainer } from "@pixi/index";
import type { AlignPos }      from "@platform/engine/ui/base-types";

export const setContainerId = (container:PixiContainer, id:string):void => {
	container.name     = id;
	container['label'] = id;
};

export const alignPosition = (child:PixiContainer, alignPos:AlignPos, sizeArea:ViewPort, pivotPos?:AlignPos):void => {

	if(typeof alignPos.x == 'string') {
		const posX = alignPos.x;
		switch(posX) {
			case "left":
				child.x = sizeArea.x;
				break;
			case "right":
				child.x = sizeArea.x + sizeArea.width;
				break;
			case "center":
				child.x = sizeArea.x + sizeArea.width * 0.5;
				break;
			default:
				assertNever(posX);
		}
	}
	else {
		child.x = alignPos.x || 0;
	}

	if(typeof alignPos.y == 'string') {
		const posY = alignPos.y;
		switch(posY) {
			case "top":
				child.y = sizeArea.y;
				break;
			case "bottom":
				child.y = sizeArea.y + sizeArea.height;
				break;
			case "center":
				child.y = sizeArea.y + sizeArea.height * 0.5;
				break;
			default:
				assertNever(posY);
		}
	}
	else {
		child.y = alignPos.y || 0;
	}

	if(pivotPos) {
		if(typeof pivotPos.x == 'string') {
			const posX = pivotPos.x;
			switch(posX) {
				case "left":
					child.pivot.x = 0;
					break;
				case "right":
					child.pivot.x = child.width;
					break;
				case "center":
					child.pivot.x = child.width * 0.5;
					break;
				default:
					assertNever(posX);
			}
		}
		else {
			child.pivot.x = 0;
		}

		if(typeof pivotPos.y == 'string') {
			const posY = pivotPos.y;
			switch(posY) {
				case "top":
					child.pivot.y = 0;
					break;
				case "bottom":
					child.pivot.y = child.height;
					break;
				case "center":
					child.pivot.y = child.height * 0.5;
					break;
				default:
					assertNever(posY);
			}
		}
		else {
			child.pivot.y = 0;
		}
	}
};