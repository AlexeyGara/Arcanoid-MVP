/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: TransitionStrategy.ts
 * Path: src/core/fsm/strategy/
 * Author: alexeygara
 * Last modified: 2026-02-18 10:12
 */

import type {
	IState,
	ITransitionStrategy
}                               from "@core-api/fsm-types";
import { processStatesClosing } from "core/fsm/strategy/strategies";

export class TransitionStrategy<TSTATEid extends STATEidBase, TEvents extends EventBase>
	implements ITransitionStrategy<TSTATEid, TEvents> {

	constructor() {
	}

	async doTransition(
		statesToClose:IState<TSTATEid, TEvents>[],
		stateToOpen:IState<TSTATEid, TEvents>,
		eventPayload:TEvents[keyof TEvents]
	):Promise<void> {

		await processStatesClosing(
			statesToClose,

			async ():Promise<void> => {
				// attach & enter to a new state:

				await stateToOpen.attach();

				await stateToOpen.enter(eventPayload);
			},

			():void => {
				// start a new state:

				stateToOpen.start();
			});

	}

}