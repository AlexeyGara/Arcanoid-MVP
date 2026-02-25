/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: WorldFlow.ts
 * Path: src/game/logic/ecs/
 * Author: alexeygara
 * Last modified: 2026-02-26 00:28
 */

import { World }                 from "@releaseband/ecs";
import { CAnimation }            from "game/logic/ecs/animation/CAnimation";
import { SAnimation }            from "game/logic/ecs/animation/SAnimation";
import { CBall }                 from "game/logic/ecs/bal/CBall";
import { CRigidBody }            from "game/logic/ecs/collide/CRigidBody";
import { SCollideCheck }         from "game/logic/ecs/collide/SCollideCheck";
import { SCollideProcess }       from "game/logic/ecs/collide/SCollideProcess";
import { CHealth }               from "game/logic/ecs/health/CHealth";
import { SHealthProcess }        from "game/logic/ecs/health/SHealthProcess";
import { MAX_ENTITIES_AT_WORLD } from "game/logic/ecs/index";
import { CInputControlled }      from "game/logic/ecs/input/CInputControlled";
import { SInputKey }             from "game/logic/ecs/input/SInputKey";
import { SInputTouch }           from "game/logic/ecs/input/SInputTouch";
import { CVelocity }             from "game/logic/ecs/movement/CVelocity";
import { SInputToMove }          from "game/logic/ecs/movement/SInputToMove";
import { SMovement }             from "game/logic/ecs/movement/SMovement";
import { CPosition }             from "game/logic/ecs/position/CPosition";
import { CSound }                from "game/logic/ecs/sound/CSound";
import { SSound }                from "game/logic/ecs/sound/SSound";
import type { WorldFlowContext } from "game/logic/ecs/WorldFlowContext";

export class WorldFlow {

	private readonly _world:World;
	private _context:WorldFlowContext;

	constructor(
		context:WorldFlowContext
	) {
		this._context = context;

		this._world = new World(MAX_ENTITIES_AT_WORLD);
	}

	start():void {

		this._setupComponents();

		this._setupSystems();

	}

	private _setupComponents():void {

		this._world.registerComponent(CBall);
		this._world.registerComponent(CRigidBody);
		this._world.registerComponent(CHealth);
		this._world.registerComponent(CInputControlled);
		this._world.registerComponent(CVelocity);
		this._world.registerComponent(CPosition);

		this._world.registerComponent(CSound);
		this._world.registerComponent(CAnimation);
	}

	private _setupSystems():void {

		this._world.addSystem(new SInputKey(this._world,
											this._context.input.keys.leftKey,
											this._context.input.keys.rightKey));
		this._world.addSystem(new SInputTouch(this._world,
											  this._context.input.touches.leftTouch,
											  this._context.input.touches.rightTouch));

		this._world.addSystem(new SInputToMove(this._world));

		this._world.addSystem(new SMovement(this._world));

		this._world.addSystem(new SCollideCheck(this._world,
												this._context.gamefield.collideSectors));

		this._world.addSystem(new SHealthProcess(this._world));

		this._world.addSystem(new SCollideProcess(this._world));

		this._world.addSystem(new SAnimation(this._world,
											 this._context.systems.animation.starter,
											 this._context.systems.animation.player));
		this._world.addSystem(new SSound(this._world,
										 this._context.systems.sound));
	}

}