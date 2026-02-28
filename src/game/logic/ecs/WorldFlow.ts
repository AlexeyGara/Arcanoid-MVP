/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: WorldFlow.ts
 * Path: src/./
 * Author: alexeygara
 * Last modified: 2026-02-26 00:28
 */

import type { ComponentInstance } from "@releaseband/ecs";
import { World }                  from "@releaseband/ecs";
import { CBall }                  from "./bal/CBall";
import { SLaunchBall }            from "./bal/SLaunchBall";
import { CCollided }              from "./collide/CCollided";
import { CRigidBody }             from "./collide/CRigidBody";
import { SCollideCheck }          from "./collide/SCollideCheck";
import { SCollideProcess }        from "./collide/SCollideProcess";
import { CDestroy }               from "./health/CDestroy";
import { CHealth }                from "./health/CHealth";
import { SDestroy }               from "./health/SDestroy";
import { SHealthProcess }         from "./health/SHealthProcess";
import type { ViewState }         from "./index";
import {
	BALL_RADIUS,
	DEFAULT_BLOCK_HEALTH,
	MAX_ENTITIES_AT_WORLD
}                                 from "./index";
import { CInputControlled }       from "./input/CInputControlled";
import { SInputKey }              from "./input/SInputKey";
import { SInputTouch }            from "./input/SInputTouch";
import { CVelocity }              from "./movement/CVelocity";
import { SInputToMove }           from "./movement/SInputToMove";
import { SMovement }              from "./movement/SMovement";
import { CPosition }              from "./position/CPosition";
import { CView }                  from "./view/CView";
import { CViewState }             from "./view/CViewState";
import { SViewUpdate }            from "./view/SViewUpdate";
import type { WorldFlowContext }  from "./WorldFlowContext";

const spawnEntity = <TComponents>(world:World,
								  components:ComponentInstance<TComponents>[],
								  entityName?:string):number => {
	const entity = world.createEntity(entityName);
	for(const component of components) {
		world.addComponent(entity, component);
	}
	return entity;
};

export class WorldFlow {

	private readonly _world:World;
	private _context:WorldFlowContext;

	constructor(
		context:WorldFlowContext
	) {
		this._context = context;

		this._world = new World(MAX_ENTITIES_AT_WORLD);
	}

	start():World {

		this._setupComponents();

		this._setupSystems();

		return this._world;
	}

	private _setupComponents():void {

		this._world.registerComponent(CBall);
		this._world.registerComponent(CRigidBody);
		this._world.registerComponent(CCollided);
		this._world.registerComponent(CHealth);
		this._world.registerComponent(CInputControlled);
		this._world.registerComponent(CVelocity);
		this._world.registerComponent(CPosition);
		this._world.registerComponent(CView);
		this._world.registerComponent(CViewState);
		this._world.registerComponent(CDestroy);

		//this._world.registerComponent(CSound);
		//this._world.registerComponent(CAnimation);
	}

	private _setupSystems():void {

		this._world.addSystem(new SInputKey(this._world,
											this._context.input.keys.leftKey,
											this._context.input.keys.rightKey));
		this._world.addSystem(new SInputTouch(this._world,
											  this._context.input.touches.leftTouch,
											  this._context.input.touches.rightTouch));

		this._world.addSystem(new SInputToMove(this._world));

		this._world.addSystem(new SMovement(this._world,
											this._context.gamefield.area));

		this._world.addSystem(new SCollideCheck(this._world,
												this._context.gamefield.collideSectors,
												this._context.gamefield.area));

		this._world.addSystem(new SHealthProcess(this._world));

		this._world.addSystem(new SCollideProcess(this._world));

		this._world.addSystem(new SViewUpdate(this._world));

		this._world.addSystem(new SDestroy(this._world));

		//this._world.addSystem(new SAnimation(this._world,
		//									 this._context.systems.animation.starter,
		//									 this._context.systems.animation.player));
		//this._world.addSystem(new SSound(this._world,
		//								 this._context.systems.sound));

		this._world.addSystem(new SLaunchBall(this._world));
	}

	addBoard(size:Size<number>, pos:Point<number>,
			 updatePos:InstanceType<typeof CView>['alignPosCallback'],
			 displayMode:(mode:ViewState) => void):void {

		spawnEntity(this._world, [
			new CRigidBody(size.width, size.height),
			new CInputControlled(),
			new CVelocity(),
			new CPosition(pos.x, pos.y),
			new CView(updatePos),
			new CViewState(displayMode)
		], "board");
	}

	addBall(pos:Point<number>, displayMode:(mode:ViewState) => void, placeOnBoard?:boolean):Point<number> {

		if(placeOnBoard) {
			const boardEntity = this._world.getEntity("board");
			if(boardEntity !== undefined) {
				const cPos   = this._world.getComponent(boardEntity, CPosition);
				const cRigid = this._world.getComponent(boardEntity, CRigidBody);
				pos.x        = cPos.posX;
				pos.y        = cPos.posY - cRigid.boxHeight / 2 - BALL_RADIUS;
			}
		}

		spawnEntity(this._world, [
			new CBall(BALL_RADIUS),
			new CVelocity(),
			new CPosition(pos.x, pos.y),
			new CView(({ posX, posY }) => {
				pos.x = posX;
				pos.y = posY;
			}),
			new CViewState(displayMode)
		]);

		return pos;
	}

	addBlock(posX:number, posY:number, width:number, height:number, displayMode:(mode:ViewState) => void):void {
		spawnEntity(this._world, [
			new CPosition(posX, posY),
			new CRigidBody(width, height),
			new CHealth(DEFAULT_BLOCK_HEALTH),
			new CViewState(displayMode)
		]);
	}

}