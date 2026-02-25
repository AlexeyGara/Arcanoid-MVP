/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: SAnimation.ts
 * Path: src/game/logic/ecs/animation/
 * Author: alexeygara
 * Last modified: 2026-02-25 23:12
 */

import type {
	AnimationStarter,
	IAnimation,
	IAnimationPlayer
}                     from "@core-api/animation-types";
import type {
	Query,
	System,
	World
}                     from "@releaseband/ecs";
import { CAnimation } from "game/logic/ecs/animation/CAnimation";

export class SAnimation

	implements System {

	private readonly _world:World;
	private readonly _query:Query;
	private readonly _animStarter:AnimationStarter;
	private readonly _animPlayer:IAnimationPlayer;

	constructor(
		world:World,
		animStarter:AnimationStarter,
		animPlayer:IAnimationPlayer
	) {
		this._world       = world;
		this._animStarter = animStarter;
		this._animPlayer  = animPlayer;
		this._query       = world.createQuery([CAnimation]);
	}

	update(_:number):void {
		for(const entity of this._query.entities) {
			const cAnim = this._world.getComponent(entity, CAnimation);

			if(cAnim.animationsIds.size) {
				for(const animId of [...cAnim.animationsIds]) {
					cAnim.animationsIds.delete(animId);
					this._playAnimationById(animId, entity);
				}
			}

			if(cAnim.animations.size) {
				for(const anim of [...cAnim.animations]) {
					cAnim.animations.delete(anim);
					this._playAnimation(anim, entity);
				}
			}

			this._checkAndRemoveComponent(entity, cAnim);
		}
	}

	enable():void {
	}

	disable():void {
	}

	exit():void {

		for(const entity of this._query.entities) {
			const cAnim = this._world.getComponent(entity, CAnimation);
			for(const anim of cAnim.animations) {
				anim.cancel();
			}
		}

		this._world.removeQuery(this._query);
	}

	private _playAnimationById(animId:string, entity:number):void {

		this._animStarter.start(animId).catch((e) => {
			logger.warn(`Cannot start animation by id '${animId}' by reason: ${String(e)}`);
		}).finally(() => {
			this._checkAndRemoveComponent(entity);
		});
	}

	private _playAnimation(anim:IAnimation, entity:number):void {

		this._animPlayer.play(anim).catch((e) => {
			logger.warn(`Cannot play animation with tag '${anim.tag}' by reason: ${String(e)}`);
		}).finally(() => {
			this._checkAndRemoveComponent(entity);
		});
	}

	private _checkAndRemoveComponent(entity:number, cAnim?:CAnimation):void {

		cAnim ||= this._world.getComponent(entity, CAnimation);

		if(!cAnim) {
			return;
		}

		if(!cAnim.animationsIds.size && !cAnim.animations.size) {
			this._world.removeComponent(entity, CAnimation);
		}
	}

}