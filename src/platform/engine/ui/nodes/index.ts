/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: index.ts
 * Path: src/platform/engine/ui/nodes/
 * Author: alexeygara
 * Last modified: 2026-02-17 23:31
 */

import type { InteractEventType } from "@platform/engine/interraction";

export interface INodeUI {
	readonly id:string;

	setId(value:string):void;

	x:number;
	y:number;
	/** The angle of rotation in degrees. */
	rotation:number;

	readonly width:number;
	readonly height:number;

	readonly originWidth:number;
	readonly originHeight:number;

	pivotX:number;
	pivotY:number;

	readonly scaleX:number;
	readonly scaleY:number;

	readonly skewX:number;
	readonly skewY:number;

	alpha:number;
	/** Hide but all transforms will continue to calculate. */
	visible:boolean;
	/** Hide and stop calculate all transforms. */
	enable:boolean;
	/** Should this object be rendered if the bounds of this object are out of frame?
	 * Culling has no effect on whether updateTransform is called. */
	cullable:boolean;
	/** Determines if the children to the container can be culled.
	 * Setting this to "false" allows to bypass a recursive culling function Which can help to optimize very complex scenes. */
	cullableChildren:boolean;

	readonly cullArea?:Rectangle<number>;

	readonly boundsArea?:Rectangle<number>;

	getCurrPos():Point<number>;

	getGlobalCurrPos():Point<number>;

	setPos(posData:Point<number>):void;

	/**
	 * Calculates the global position of this object.
	 * @param worldOrigin The world origin to calculate from.
	 * @param out
	 */
	toGlobal(worldOrigin:Point<number>, out?:Point<number>):Point<number>;

	/**
	 * Calculates the local position of this object relative to another point.
	 * @param worldOrigin The world origin to calculate from.
	 * @param from The Container to calculate the global position from.
	 * @param out
	 */
	toLocal(worldOrigin:Point<number>, from?:INodeUI, out?:Point<number>):Point<number>;

	getCurrPivot():Point<number>;

	setPivot(posData:Point<number>):void;

	getCurrScale():Point<number>;

	getCurrSize():Size<number>;

	getCurrSkew():Point<number>;

	setCullArea(cullAreaData:Rectangle<number>):void;

	setBoundsArea(boundsData:Rectangle<number>):void;

	/** Calculate and return own local bounds relatively pivot point. */
	getBounds():Bounds<number>;

	/** Calculates and returns the (world) bounds as a Rectangle. Takes into account transforms and child bounds. */
	getGlobalBounds():Bounds<number>;

	readonly parent:INodeUI | null;

	removeFromParent():void;

	/** Caches this container as a texture.
	 * This allows the container to be rendered as a single texture, which can improve performance for complex static containers. */
	cacheAsTexture:boolean;

	readonly isCachedAsTexture:boolean;

	/** Updates the cached texture of this container.
	 * This will flag the container's cached texture to be redrawn on the next render. */
	updateCacheTexture():void;

	/** The zIndex of this object. */
	zIndex:uint;
}

export interface IDisposableNode extends INodeUI {
	disposed:boolean;

	/** Do not use object and any own props after dispose. */
	dispose(withAllContentAndResources?:boolean):void;
}

export interface IHaveChildrenNodeUI extends INodeUI {

	/** Determines if the children can be clicked/touched.
	 * Setting this to 'false' allows to bypass a recursive hitTest. */
	interactiveChildren:boolean;

	/** Not ordered list of children */
	readonly children:INodeUI[];

	addChild(child:INodeUI):void;

	addChildAt(child:INodeUI, index:uint):void;

	getChildAt(index:uint):INodeUI | null;

	/** Returns the first child in the container with the specified id.
	 * @param id
	 * @param deep search recursively
	 * */
	getChildById(id:string, deep?:boolean):INodeUI | null;

	/**
	 * Returns all children in the container with the specified id.
	 * @param id
	 * @param deep search recursively
	 * @param out array to store matching children
	 */
	getChildrenById(id:string, deep?:boolean, out?:INodeUI[]):INodeUI[];

	/**
	 * Returns the index position of a child.
	 * @return position index of a child. Return '-1' if wasn't found.
	 */
	getChildIndex(child:INodeUI):int;

	setChildIndex(child:INodeUI, newIndex:uint):boolean;

	swapChildren(child1:INodeUI, child2:INodeUI):boolean;

	removeChild(child:INodeUI):void;

	removeChildAt(index:uint):INodeUI | null;

	/**
	 * Reparent specified child to this container, keeping the same worldTransform.
	 */
	reparentChild(child:INodeUI):void;

	/**
	 * Reparent specified child to this container, keeping the same worldTransform.
	 */
	reparentChildAt(child:INodeUI, index:uint):void;
}

export type InteractEvent = {
	//target:INodeUI,
	//currentTarget:INodeUI,
	//bubbles:boolean,
	//cancelable:boolean,
	//stopPropagation:() => void,

	readonly isTrusted:boolean;
	readonly defaultPrevented:boolean;

	readonly type:InteractEventType;
	readonly pointerId:int;
	readonly posX:number;
	readonly posY:number;
	readonly globalX:number;
	readonly globalY:number;
	readonly movementX:number;
	readonly movementY:number;
	/** The timestamp of when the event was created. */
	readonly timeStamp:uintMoreZero;
}

export type InteractEventCallback = (event:InteractEvent) => void;

export type InteractEventHandler = InteractEventCallback;

export interface IInteractiveEmitterNodeUI {

	/** Fired when a pointer performs a quick tap. */
	onPointerTap?:InteractEventCallback;
	/** Fired when a pointer (mouse, pen, or touch) is pressed on a display object. */
	onPointerDown?:InteractEventCallback;
	/** Fired when the pointer is released over the display object. */
	onPointerUp?:InteractEventCallback;
	/** Fired when the pointer is released outside the object that received pointerdown. */
	onPointerUpOutside?:InteractEventCallback;
	/** Fired when the pointer moves over the display object. */
	onPointerMove?:InteractEventCallback;
	/** Fired when the pointer enters the boundary of the object. */
	onPointerOver?:InteractEventCallback;
	/** Fired when the pointer leaves the boundary of the display object. */
	onPointerOut?:InteractEventCallback;
	/** Fired when the pointer interaction is canceled (e.g. touch lost). */
	onPointerCancel?:InteractEventCallback;

	on(event:InteractEventType, listener:InteractEventHandler, once?:boolean):void;

	off(event:InteractEventType, listener:InteractEventHandler):void;
}

export interface IInteractiveNodeUI extends INodeUI {
	interactive:boolean;
	//interactMode:InteractMode;
	//readonly isInteractive:boolean;

	hitArea?:{ contains:(x:number, y:number) => boolean };

	setRectangleHitArea(areaData:Rectangle<number>):void;
}

export interface IResizableNodeUI extends INodeUI {
	/** The width of the node, setting this will actually modify the scale to achieve the value set.
	 * [!NOTE] Changing the width will adjust the scale.x property of the container while maintaining its aspect ratio.
	 * [!NOTE] If you want to set both width and height at the same time, use Container#setSize as it is more optimized by not recalculating the local bounds twice.
	 * */
	width:number;
	/** The height of the node, setting this will actually modify the scale to achieve the value set.
	 * [!NOTE] Changing the width will adjust the scale.y property of the container while maintaining its aspect ratio.
	 * [!NOTE] If you want to set both width and height at the same time, use Container#setSize as it is more optimized by not recalculating the local bounds twice.
	 * */
	height:number;

	setSize(sizeData:Size<number>):void;

	scaleX:number;
	scaleY:number;

	setScale(scaleData:Point<number>):void;

	skewX:number;
	skewY:number;

	setSkew(skewData:Point<number>):void;
}

export interface ITextNodeUI extends INodeUI {
	text:string;
}