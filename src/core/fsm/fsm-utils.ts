/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: fsm-utils.ts
 * Path: src/core/fsm/
 * Author: alexeygara
 * Last modified: 2026-02-19 23:57
 */

import type {
	HandleEventTransitionResult,
	IState,
	ITransitionStrategy,
	OverlayTransitionProvider,
	Transition
}                           from "@core-api/fsm-types";
import { StateOverlayMode } from "core/fsm/state/StateOverlayMode";

/**
 * Check transition to a new state is permitted!
 * @param currState Current state that should transition to a new.
 * @param triggerEvent Event that triggering transition.
 * @param transition Transition to a new state.
 * @param isNewStateAvailable Is a 'new state registered & available to create' check method.
 * @param flowContext Current flow-context.
 * @param activeTransition Active transition if any.
 */
export const checkTransitionPermit = <TSTATEid extends STATEidBase, TEvents extends EventBase, TContext extends ContextBase>(
	currState:IState<TSTATEid, TEvents>,
	triggerEvent:keyof TEvents,
	transition:Transition<TSTATEid, TEvents, TContext>,
	isNewStateAvailable:(stateId:TSTATEid) => boolean,
	flowContext:TContext,
	activeTransition?:Transition<TSTATEid, TEvents, TContext>,
):HandleEventTransitionResult<TSTATEid> | true => {

	if(activeTransition) {
		if(!activeTransition.canInterrupt
		   //TODO: remove that when active transition cancellation will be implemented - @see StateMachine.handle()
		   || true
		) {
			return {
				triggerEvent: String(triggerEvent),
				result:       "blocked",
				fromStateId:  activeTransition.fromStateId,
				toStateId:    activeTransition.toStateId,
				info:         `State machine is under transition from '${activeTransition.fromStateId}' to '${activeTransition.toStateId}' and cannot interrupt by event '${String(
					triggerEvent)}'!`
			};
		}
	}

	if(
		!isNewStateAvailable(transition.toStateId) /* new state is not registered and cannot be created */ ||
		(
			!transition.fromStateId /* new state is 'overlay'-state... */ &&
			currState.overlayMode == StateOverlayMode.FORBIDDEN /* ...but current state cannot be overlapped  */
		)
	) {
		return {
			triggerEvent: String(triggerEvent),
			result:       "blocked",
			fromStateId:  currState.stateId,
			toStateId:    transition.toStateId,
			info:         transition.fromStateId
						  ? `State '${transition.toStateId}' have not been registered at state machine!`
						  : `State '${transition.toStateId}' cannot overlay the current '${currState.stateId}' one.`
		};
	}

	if(transition.guard && !transition.guard(flowContext)) {
		return {
			triggerEvent: String(triggerEvent),
			result:       "blocked",
			fromStateId:  currState.stateId,
			toStateId:    transition.toStateId,
			info:         `Transition to state '${transition.toStateId}' blocked by guard.`
		};
	}

	return true;
};

export const resolveTransitionStrategy = <TSTATEid extends STATEidBase, TEvents extends EventBase, TContext extends ContextBase>(
	currState:IState<TSTATEid, TEvents>,
	transition:Transition<TSTATEid, TEvents, TContext>,
	transitionStrategy:ITransitionStrategy<TSTATEid, TEvents>,
	overlayStrategyProvider:OverlayTransitionProvider<TSTATEid, TEvents>,
):ITransitionStrategy<TSTATEid, TEvents> => {

	if(!transition.fromStateId /* new state is 'overlay'-state... */) {
		return overlayStrategyProvider(currState.overlayMode);
	}

	return transitionStrategy;
};