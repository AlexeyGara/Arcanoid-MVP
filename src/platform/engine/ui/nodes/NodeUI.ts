/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: NodeUI.ts
 * Path: src/platform/engine/ui/nodes/
 * Author: alexeygara
 * Last modified: 2026-02-18 08:40
 */

import type { SceneResourceType } from "@platform/engine/resources";
import type {
	IDisposableNode,
	INodeUI,
	IResizableNodeUI
}                                 from "@platform/engine/ui/nodes/index";

export abstract class NodeUI implements INodeUI,
										IResizableNodeUI,
										IDisposableNode {

	abstract readonly resType:SceneResourceType;

	protected constructor(id:string) {
		this._id = id;
	}

	// node id
	private _id:string;
	get id():string {
		return this._id;
	}

	setId(value:string):void {
		this._id = value;
	}

	// position
	abstract get x():number;
	abstract set x(value:number);

	abstract get y():number;
	abstract set y(value:number);

	abstract getCurrPos():Point<number>;

	abstract setPos(positionData:Point<number>):void;

	abstract getGlobalCurrPos():Point<number>;

	abstract toGlobal(worldOrigin:Point<number>, out?:Point<number>):Point<number>;

	abstract toLocal(worldOrigin:Point<number>, from?:INodeUI, out?:Point<number>):Point<number>;

	// size (the set of 'width' and/or 'height' are changing the 'scale' as well)
	abstract get width():number;
	abstract set width(value:number);

	abstract get height():number;
	abstract set height(value:number);

	abstract getCurrSize():Size<number>;

	abstract setSize(size:Size<number>):void;

	abstract get originWidth():number;

	abstract get originHeight():number;

	/** The angle of rotation in degrees. */
	abstract get rotation():number;
	abstract set rotation(value:number);

	// pivot point
	abstract get pivotX():number;
	abstract set pivotX(value:number);

	abstract get pivotY():number;
	abstract set pivotY(value:number);

	abstract getCurrPivot():Point<number>;

	abstract setPivot(pivotData:Point<number>):void;

	// scale (the set of 'scale' are changing the 'width' and/or 'height' as well)
	abstract get scaleX():number;
	abstract set scaleX(value:number);

	abstract get scaleY():number;
	abstract set scaleY(value:number);

	abstract getCurrScale():Point<number>;

	abstract setScale(scaleData:Point<number>):void;

	// skew
	abstract get skewX():number;
	abstract set skewX(value:number);

	abstract get skewY():number;
	abstract set skewY(value:number);

	abstract getCurrSkew():Point<number>;

	abstract setSkew(skewData:Point<number>):void

	// alpha
	abstract get alpha():number;
	abstract set alpha(value:number);

	/** Hide but all transforms will continue to calculate. */
	abstract get visible():boolean;
	abstract set visible(value:boolean);

	/** Hide and stop calculate all transforms. */
	abstract get enable():boolean;
	abstract set enable(value:boolean);

	// culling mode and area
	abstract get cullable():boolean;
	abstract set cullable(value:boolean);

	abstract get cullableChildren():boolean;
	abstract set cullableChildren(value:boolean);

	abstract get cullArea():Rectangle<number> | undefined;

	abstract setCullArea(cullAreaData:Rectangle<number>):void;

	// bounds
	abstract get boundsArea():Rectangle<number> | undefined;

	abstract setBoundsArea(boundsData:Rectangle<number>):void;

	abstract getBounds():Bounds<number>;

	abstract getGlobalBounds():Bounds<number>;

	// render optimization
	abstract get cacheAsTexture():boolean;

	abstract get isCachedAsTexture():boolean;

	abstract updateCacheTexture():void;

	// render order
	abstract get zIndex():uint;
	abstract set zIndex(value:uint);

	// parent node
	abstract get parent():INodeUI | null;

	abstract removeFromParent():void;

	// disposed (Do not use this node after dispose!)
	abstract get disposed():boolean;

	abstract dispose(withAllContentAndResources?:boolean):void;
}