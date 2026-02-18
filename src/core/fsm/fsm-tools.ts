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
} from "@core-api/fsm-types";

/**
 * Resolve the highest priority state of the current one and of all overlay states.
 * @param currState Current base state.
 * @param overlayStates All active overlay states.
 * @return The dominant (priority highest) state.
 */
export const resolveDominantState = <TSTATEid extends STATEidBase, TEvents extends EventBase>(
	currState:IState<TSTATEid, TEvents>,
	overlayStates:Readonly<IState<TSTATEid, TEvents>[]>
):IState<TSTATEid, TEvents> => {

	if(!overlayStates.length) {/* there are no any overlay states */
		return currState;
	}

	if(!currState.critical) {/* current state is not critical: get the top one in overlay states */
		return overlayStates[overlayStates.length - 1];
	}

	let highPriorityState = currState;
	for(const overState of overlayStates) {

		if(overState.critical) {/* Any critical overlay state has a high priority above current state. */
			highPriorityState = overState;
			continue;
		}

		if(highPriorityState != currState) {/* Any top overlay state has a more high priority above bottom overlay states. */
			highPriorityState = overState;
			continue;
		}

		if(!currState.critical) {/* Any top overlay state has a more high priority above not critical current. */
			highPriorityState = overState;
		}
	}

	return highPriorityState;
};

/**
 * Get all active states (current state and overlay states) sorted by priority.
 * The highest priority state will be first. Any _**'critical'**_ state will cut off all lower states below.
 * @param currState Current base state.
 * @param overlayStates All active overlay states.
 * @return The ordered list of all states that can be transit to another by suitable event. The first state has the highest priority.
 */
export const getPrioritySortedStates = <TSTATEid extends STATEidBase, TEvents extends EventBase>(
	currState:IState<TSTATEid, TEvents>,
	overlayStates:Readonly<IState<TSTATEid, TEvents>[]>
):IState<TSTATEid, TEvents>[] => {

	const result = [currState];

	for(const overlayState of overlayStates) {

		if(overlayState.critical) {
			result.length = 0;
			result.push(overlayState);
			continue;
		}

		if(!currState.critical || result.length > 1 || result[result.length - 1] != currState) {
			result.unshift(overlayState);
		}
	}

	return result;
};

/**
 *
 * @param event
 * @param currState
 * @param overlayStates
 * @param registeredTransitions
 * @return A tuple: [found transition, from state]
 */
export const findTransition = <TSTATEid extends STATEidBase, TEvents extends EventBase, TContext extends ContextBase>(
	event:keyof TEvents,
	currState:IState<TSTATEid, TEvents>, overlayStates:Readonly<IState<TSTATEid, TEvents>[]>,
	registeredTransitions:Map<TSTATEid, Transition<TSTATEid, TEvents, TContext>[]>
):[Transition<TSTATEid, TEvents, TContext>, IState<TSTATEid, TEvents>] | [undefined, undefined] => {

	const statesByPriority = getPrioritySortedStates(currState, overlayStates);

	for(const priorState of statesByPriority) {

		const transitions = registeredTransitions.get(priorState.stateId);
		if(transitions) {
			for(const transition of transitions) {
				if(transition.onEvent == event) {
					return [transition, priorState];
				}
			}
		}
	}

	return [undefined, undefined];
};

/**
 * Check transition to a new state is permitted!
 * @param dominantState Current dominant state that should transition to a new.
 * @param triggerEvent Event that triggering transition.
 * @param transition Transition to a new state.
 * @param isNewStateAvailable Is a 'new state registered & available to create' check method.
 * @param flowContext Current flow-context.
 * @param activeTransition Active transition if any.
 * @return Return 'true' if transition is permitted. Otherwise, return a {@link #HandleEventTransitionResult } within 'blocked' info.
 */
export const checkTransitionPermit = <TSTATEid extends STATEidBase, TEvents extends EventBase, TContext extends ContextBase>(
	dominantState:IState<TSTATEid, TEvents>,
	triggerEvent:keyof TEvents,
	transition:Transition<TSTATEid, TEvents, TContext>,
	isNewStateAvailable:(stateId:TSTATEid) => boolean,
	flowContext:TContext,
	activeTransition?:Transition<TSTATEid, TEvents, TContext>,
):HandleEventTransitionResult<TSTATEid> | true => {

	if(dominantState.stateId != transition.fromStateId) {
		return {
			triggerEvent: String(triggerEvent),
			result:       "blocked",
			fromStateId:  dominantState.stateId,
			toStateId:    transition.toStateId,
			info:         `Transition's 'from' state '${transition.fromStateId}' does not match with current dominant state '${dominantState.stateId}'!`
		};
	}

	if(activeTransition) {
		if(!activeTransition.canInterrupt
		   //TODO: remove that 'true'-branch-force when active transition cancellation will be implemented at state machine: @see StateMachine.handle()
		   || true
		) {
			return {
				triggerEvent: String(triggerEvent),
				result:       "blocked",
				fromStateId:  activeTransition.toStateId,
				toStateId:    transition.toStateId,
				info:         `State machine is under transition from '${activeTransition.fromStateId}' to '${activeTransition.toStateId}' and cannot interrupt by event '${String(
					triggerEvent)}'!`
			};
		}
	}

	if(!transition.toStateId) {
		if(dominantState.isOverlay) {/* Current dominant overlay-state should be closed without transition to another state. */
			return true;
		}

		return {
			triggerEvent: String(triggerEvent),
			result:       "blocked",
			fromStateId:  dominantState.stateId,
			toStateId:    transition.toStateId,
			info:         `State '${dominantState.stateId}' is not 'overlay' state and have not been closed without transit to another one!`
		};
	}

	if(!isNewStateAvailable(transition.toStateId)) {/* new state is not registered and cannot be created */
		return {
			triggerEvent: String(triggerEvent),
			result:       "blocked",
			fromStateId:  dominantState.stateId,
			toStateId:    transition.toStateId,
			info:         `State '${transition.toStateId}' have not been registered at state machine!`
		};
	}

	if(transition.guard && !transition.guard(flowContext)) {
		return {
			triggerEvent: String(triggerEvent),
			result:       "blocked",
			fromStateId:  dominantState.stateId,
			toStateId:    transition.toStateId,
			info:         `Transition to state '${transition.toStateId}' blocked by guard.`
		};
	}

	return true;
};

/**
 * Resolve required transition strategy.
 * @param fromState Current state that should transition to a new.
 * @param toState
 * @param transitionStrategy Available transition strategy to a new state.
 * @param overlayStrategyProvider Available overlay strategies for add a new state.
 * @param closeOverlayStrategy
 * @return Return a tuple: [resolved strategy, 'is-overlay' flag]
 */
export const resolveTransitionStrategy = <TSTATEid extends STATEidBase, TEvents extends EventBase>(
	fromState:IState<TSTATEid, TEvents>,
	toState:IState<TSTATEid, TEvents> | undefined,
	transitionStrategy:ITransitionStrategy<TSTATEid, TEvents>,
	overlayStrategyProvider:OverlayTransitionProvider<TSTATEid, TEvents>,
	closeOverlayStrategy:ITransitionStrategy<TSTATEid, TEvents>
):ITransitionStrategy<TSTATEid, TEvents> => {

	if(!toState) {/* current dominant state should be just closed */
		return closeOverlayStrategy;
	}

	if(toState.isOverlay) {
		return overlayStrategyProvider(fromState.overlayMode);
	}

	return transitionStrategy;
};
