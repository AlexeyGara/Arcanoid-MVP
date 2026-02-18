export const TYPES = {
	IEventDispatch: Symbol.for('IEventDispatch'),
	ICanEventEmit: Symbol.for('ICanEventEmit'),
	IEventBus: Symbol.for('IEventBus'),

	ICanStatesRegister: Symbol.for('ICanStatesRegister'),
	ICanStateChange: Symbol.for('ICanStateChange'),
	IStateMachine: Symbol.for('IStateMachine'),
	IStatesFactory: Symbol.for('IStatesFactory'),
	IState: Symbol.for('IState'),

	IMusicManager: Symbol.for('IMusicManager'),
	ISoundManager: Symbol.for('ISoundManager'),

	AppContext: Symbol.for('AppContext'),
};

export const Names = {
	app_level: "app_level",
	game_level: "game_state_machine",
};