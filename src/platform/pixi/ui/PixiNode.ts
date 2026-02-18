import { InteractMode }               from "@platform/engine/interraction";
import type { SceneResourceType }     from "@platform/engine/resources";
import { ContainerResName }           from "@platform/engine/resources";
import type {
	IDisposableNode,
	IHaveChildrenNodeUI,
	IInteractiveNodeUI,
	INodeUI,
	IResizableNodeUI
}                 from "@platform/engine/ui/nodes";
import { NodeUI } from "@platform/engine/ui/nodes/NodeUI";
import type {
	Bounds as PixiBounds,
	Container as PixiContainer,
	ObservablePoint
}                 from "pixi.js";
import { Rectangle as PixiRectangle } from "pixi.js";

export function setContainerId(container:PixiContainer, id:string):void {
	container.name = id;
	container['label'] = id;
}

export class PixiNode extends NodeUI
	implements INodeUI,
			   IResizableNodeUI,
			   IDisposableNode,
			   IHaveChildrenNodeUI,
			   IInteractiveNodeUI {

	readonly resType:SceneResourceType = ContainerResName;

	protected readonly _pixiObject:PixiContainer;
	protected _interactive:boolean = true;
	private readonly _positionPoint:ObservablePoint;
	private readonly _pivotPoint:ObservablePoint;
	private readonly _scalePoint:ObservablePoint;
	private readonly _skewPoint:ObservablePoint;
	private _parent:PixiNode | null = null;
	private readonly _releaseAsset:() => void;
	private _originSizeGetters:{ getWidth():number; getHeight():number };

	constructor(
		pixiObject:PixiContainer,
		releaseAsset:() => void,
		id:string = "",
		originSizeGetters?:{ getWidth():number; getHeight():number }
	) {
		super(id);
		this._pixiObject = pixiObject;
		this._positionPoint = pixiObject.position;
		this._pivotPoint = pixiObject.pivot;
		this._scalePoint = this._pixiObject.scale;
		this._skewPoint = this._pixiObject.skew;
		setContainerId(this._pixiObject, id);
		this._releaseAsset = releaseAsset;
		this._originSizeGetters = originSizeGetters || {
			getWidth: ():number => this._scalePoint.x != 0 ? this._pixiObject.width / this._scalePoint.x : 0,
			getHeight: ():number => this._scalePoint.y != 0 ? this._pixiObject.height / this._scalePoint.y : 0
		};
		this.interactive = true;
	}

	get pixiObject():PixiContainer {
		return this._pixiObject;
	}

	get alpha():number {
		return this._pixiObject.alpha;
	}

	set alpha(value:number) {
		this._pixiObject.alpha = value;
	}

	/** Hide but all transforms will continue to calculate. */
	get visible():boolean {
		return this._pixiObject.renderable;
	}

	/** Hide but all transforms will continue to calculate. */
	set visible(value:boolean) {
		this._pixiObject.renderable = value;
	}

	/** Hide and stop calculate all transforms. */
	get enable():boolean {
		return this._pixiObject.visible;
	}

	/** Hide and stop calculate all transforms. */
	set enable(value:boolean) {
		this._pixiObject.visible = value;
	}

	get x():number {
		return this._positionPoint.x;
	}

	set x(value:number) {
		this._positionPoint.x = value;
	}

	get y():number {
		return this._positionPoint.y;
	}

	set y(value:number) {
		this._positionPoint.y = value;
	}

	get width():number {
		return this._pixiObject.width;
	}

	set width(value:number) {
		this._pixiObject.width = value;
	}

	get originWidth():number {
		return this._originSizeGetters.getWidth();
	}

	get height():number {
		return this._pixiObject.height;
	}

	set height(value:number) {
		this._pixiObject.height = value;
	}

	get originHeight():number {
		return this._originSizeGetters.getHeight();
	}

	get pivotX():number {
		return this._pivotPoint.x;
	}

	set pivotX(value:number) {
		this._pivotPoint.x = value;
	}

	get pivotY():number {
		return this._pivotPoint.y;
	}

	set pivotY(value:number) {
		this._pivotPoint.y = value;
	}

	/** The angle of rotation in degrees. */
	get rotation():number {
		return this._pixiObject.angle;
	}

	/** The angle of rotation in degrees. */
	set rotation(value:number) {
		this._pixiObject.angle = value;
	}

	get scaleX():number {
		return this._scalePoint.x;
	}

	set scaleX(value:number) {
		this._scalePoint.x = value;
	}

	get scaleY():number {
		return this._scalePoint.y;
	}

	set scaleY(value:number) {
		this._scalePoint.y = value;
	}

	get skewX():number {
		return this._skewPoint.x;
	}

	set skewX(value:number) {
		this._skewPoint.x = value;
	}

	get skewY():number {
		return this._skewPoint.y;
	}

	set skewY(value:number) {
		this._skewPoint.y = value;
	}

	get cullable():boolean {
		return this._pixiObject['cullable'] || false;
	}

	set cullable(value:boolean) {
		this._pixiObject['cullable'] = value;
	}

	get cullableChildren():boolean {
		return this._pixiObject['cullableChildren'] || false;
	}

	set cullableChildren(value:boolean) {
		this._pixiObject['cullableChildren'] = value;
	}

	get disposed():boolean {
		return this._pixiObject.destroyed;
	}

	getCurrPivot():Point<number> {
		return { x: this._pivotPoint.x, y: this._pivotPoint.y };
	}

	setPivot(pivotData:Point<number>):void {
		this._pivotPoint.x = pivotData.x;
		this._pivotPoint.y = pivotData.y;
	}

	getCurrPos():Point<number> {
		return { x: this._positionPoint.x, y: this._positionPoint.y };
	}

	setPos(positionData:Point<number>):void {
		this._positionPoint.x = positionData.x;
		this._positionPoint.y = positionData.y;
	}

	getCurrScale():Point<number> {
		return { x: this._scalePoint.x, y: this._scalePoint.y };
	}

	setScale(scaleData:Point<number>):void {
		this._scalePoint.x = scaleData.x;
		this._scalePoint.y = scaleData.y;
	}

	getCurrSize():Size<number> {
		return this._pixiObject.getSize();
	}

	setSize(size:Size<number>):void {
		this._pixiObject.setSize(size.width, size.height);
	}

	getCurrSkew():Point<number> {
		return { x: this._skewPoint.x, y: this._skewPoint.y };
	}

	setSkew(skewData:Point<number>):void {
		this._skewPoint.x = skewData.x;
		this._skewPoint.y = skewData.y;
	}

	dispose(fullyDispose?:boolean):void {
		if(this.disposed) {
			return;
		}

		for(const childNode of this._childNodes) {
			childNode.dispose();
		}
		this._childNodes.clear();

		this._pixiObject.destroy({
									 children: true,
									 texture: !!fullyDispose,
									 textureSource: !!fullyDispose,
									 context: !!fullyDispose,
									 style: !!fullyDispose
								 });
		this._releaseAsset();
	}

	get boundsArea():Rectangle<number> | undefined {
		return this._pixiObject.boundsArea;
	}

	setBoundsArea(boundsData:Rectangle<number>):void {
		this._pixiObject.boundsArea = new PixiRectangle(boundsData.x, boundsData.y,
														boundsData.width, boundsData.height);
	}

	getBounds():Bounds<number> {
		const bounds:PixiBounds = this._pixiObject.getLocalBounds();// || this._pixiObject['bounds'];
		if(bounds) {
			return {
				left: bounds.minX, right: bounds.maxX,
				top: bounds.minY, bottom: bounds.maxY,
				width: bounds.width, height: bounds.height
			};
		}
		const w = this._pixiObject.width;
		const h = this._pixiObject.height;
		return {
			left: -this._pivotPoint.x, right: w - this._pivotPoint.x,
			top: -this._pivotPoint.y, bottom: h - this._pivotPoint.y,
			width: w, height: h
		};
	}

	getGlobalBounds():Bounds<number> {
		const gBounds = this._pixiObject.getBounds();
		return {
			left: gBounds.minX, right: gBounds.maxX,
			top: gBounds.minY, bottom: gBounds.maxY,
			width: gBounds.width, height: gBounds.height
		};
	}

	get cullArea():Rectangle<number> | undefined {
		return this._pixiObject['cullArea'];
	}

	setCullArea(cullAreaData:Rectangle<number>):void {
		this._pixiObject['cullArea'] = new PixiRectangle(cullAreaData.x, cullAreaData.y,
														 cullAreaData.width, cullAreaData.height);
	}

	get cacheAsTexture():boolean {
		return this._pixiObject.isCachedAsTexture;
	}

	set cacheAsTexture(value:boolean) {
		this._pixiObject.cacheAsTexture(value);
	}

	get isCachedAsTexture():boolean {
		return this._pixiObject.isCachedAsTexture;
	}

	updateCacheTexture():void {
		this._pixiObject.updateCacheTexture();
	}

	get zIndex():uint {
		return this._pixiObject.zIndex as uint;
	}

	set zIndex(value:uint) {
		this._pixiObject.zIndex = value;
	}

	get parent():INodeUI | null {
		return this._parent;
	}

	private _deleteChildNode(childNode:PixiNode):boolean {
		return this._childNodes.delete(childNode);
	}

	private _deleteFromParentNode():boolean {
		if(this._parent) {
			return this._parent._deleteChildNode(this);
		}
		return false;
	}

	removeFromParent():void {
		this._parent?.removeChild(this);
	}

	getGlobalCurrPos():Point<number> {
		return this._pixiObject.getGlobalPosition();
	}

	toGlobal(worldOrigin:Point<number>, out?:Point<number>):Point<number> {
		out ||= { x: 0, y: 0 };
		return this._pixiObject.toGlobal(worldOrigin, out);
	}

	toLocal(worldOrigin:Point<number>, from?:INodeUI, out?:Point<number>):Point<number> {
		out ||= { x: 0, y: 0 };
		if(from) {
			return this._pixiObject.toLocal(worldOrigin, (from as PixiNode).pixiObject, out);
		}
		return this._pixiObject.toLocal(worldOrigin, undefined, out);
	}

	private _childNodes:Set<PixiNode> = new Set<PixiNode>();

	get children():INodeUI[] {
		return [...this._childNodes.values()];
	}

	addChild(childNode:INodeUI):void {
		(childNode as PixiNode)._deleteFromParentNode();

		this._childNodes.add(childNode as PixiNode);
		(childNode as PixiNode)._parent = this;

		this._pixiObject.addChild((childNode as PixiNode).pixiObject);
	}

	addChildAt(childNode:INodeUI, index:uint):void {
		(childNode as PixiNode)._deleteFromParentNode();

		this._childNodes.add(childNode as PixiNode);
		(childNode as PixiNode)._parent = this;

		this._pixiObject.addChildAt((childNode as PixiNode).pixiObject, index);
	}

	removeChild(childNode:INodeUI):void {
		if(this._childNodes.delete(childNode as PixiNode)) {
			(childNode as PixiNode)._parent = null;

			this._pixiObject.removeChild((childNode as PixiNode).pixiObject);
		}
	}

	removeChildAt(index:uint):INodeUI | null {
		const targetPixiObject = this._pixiObject.removeChildAt(index);

		if(targetPixiObject) {
			for(const childNode of this._childNodes) {
				if(childNode.pixiObject == targetPixiObject) {
					this._childNodes.delete(childNode as PixiNode);
					(childNode as PixiNode)._parent = null;
					return childNode;
				}
			}
		}

		return null;
	}

	getChildIndex(childNode:INodeUI):int {
		return this._pixiObject.getChildIndex((childNode as PixiNode).pixiObject) as int;
	}

	getChildAt(index:uint):INodeUI | null {
		const targetPixiObject = this._pixiObject.getChildAt(index);

		if(targetPixiObject) {
			for(const childNode of this._childNodes) {
				if((childNode as PixiNode).pixiObject == targetPixiObject) {
					return childNode;
				}
			}
		}

		return null;
	}

	setChildIndex(childNode:INodeUI, newIndex:uint):boolean {
		if(childNode.parent != this) {
			return false;
		}

		this._pixiObject.setChildIndex((childNode as PixiNode).pixiObject, newIndex);

		return true;
	}

	swapChildren(childNode1:INodeUI, childNode2:INodeUI):boolean {
		if(childNode1.parent != this || childNode2.parent != this) {
			return false;
		}

		this._pixiObject.swapChildren((childNode1 as PixiNode).pixiObject, (childNode2 as PixiNode).pixiObject);

		return true;
	}

	getChildById(id:string, deep?:boolean):INodeUI | null {
		for(const childNode of this._childNodes) {
			if(childNode.id == id) {
				return childNode;
			}
		}

		if(deep) {
			for(const childNode of this._childNodes) {
				const foundNode = (childNode as PixiNode).getChildById(id, deep);
				if(foundNode) {
					return foundNode;
				}
			}
		}

		return null;
	}

	getChildrenById(id:string, deep?:boolean, out?:INodeUI[]):INodeUI[] {
		const result = out || [];

		for(const childNode of this._childNodes) {
			if(childNode.id == id) {
				result.push(childNode);
			}

			if(deep) {
				(childNode as PixiNode).getChildrenById(id, deep, result);
			}
		}

		return result;
	}

	reparentChild(childNode:INodeUI):void {
		const preParent = childNode.parent;
		if(preParent && preParent != this) {
			(preParent as PixiNode)._deleteChildNode(childNode as PixiNode);
		}

		this._childNodes.add(childNode as PixiNode);
		(childNode as PixiNode)._parent = this;

		this._pixiObject.reparentChild((childNode as PixiNode).pixiObject);
	}

	reparentChildAt(childNode:INodeUI, index:uint):void {
		const preParent = childNode.parent;
		if(preParent && preParent != this) {
			(preParent as PixiNode)._deleteChildNode(childNode as PixiNode);
		}

		this._childNodes.add(childNode as PixiNode);
		(childNode as PixiNode)._parent = this;

		this._pixiObject.reparentChildAt((childNode as PixiNode).pixiObject, index);
	}

	get interactiveChildren():boolean {
		return this._pixiObject.interactiveChildren != undefined
			   ? this._pixiObject.interactiveChildren
			   : true;
	}

	set interactiveChildren(value:boolean) {
		this._pixiObject.interactiveChildren = value;
	}

	get interactive():boolean {
		return this._interactive;
	}

	set interactive(value:boolean) {
		if(this._interactive == value) {
			return;
		}

		this._interactive = value;

		this._pixiObject.interactive = value;
		this._pixiObject.eventMode = value ? InteractMode.PASSIVE : InteractMode.NONE;
	}

	get hitArea():{ contains:(x:number, y:number) => boolean } | undefined {
		return this._pixiObject.hitArea || undefined;
	}

	set hitArea(areaChecker:{ contains:(x:number, y:number) => boolean } | undefined) {
		this._pixiObject.hitArea = areaChecker;
	}

	setRectangleHitArea(areaData:Rectangle<number>):void {
		this._pixiObject.hitArea = {
			contains: (x:number, y:number):boolean => {
				return x >= areaData.x && x <= areaData.x + areaData.width &&
					   y >= areaData.y && y <= areaData.y + areaData.height;
			}
		};
	}
}