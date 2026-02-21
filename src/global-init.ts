/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: BlastGame_MVP-Cocos
 * File: global-init.ts
 * Path: assets/Script/
 * Author: alexeygara
 * Last modified: 2026-02-08 04:26
 */

//TODO: move to env

// ---- GLOBAL VARS --->

console.info(`!!GLOBAL INITIALIZED!!`);

// @ts-expect-error it's ok
const _global:Global = (// eslint-disable-line @typescript-eslint/naming-convention
	global/* node <- "moduleResolution":"node" */
	||
	window/* browser <- "moduleResolution":"classic" */
);

_global.finalMethod = function _finalMethod_(_target:{
											   // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
											   constructor:Function;
										   },
										   _propertyKey:PropertyKey,
										   descriptor:PropertyDescriptor):PropertyDescriptor {
	return descriptor;
	//not working with TS overrides
	/*
	const originalMethod = descriptor.value;
	descriptor.value = function (...args:any[]) {
		if(this.constructor !== _target.constructor) {
			throw new Error(`Cannot override final method "${_propertyKey}" in subclass "${this.constructor.name}"`);
		}
		return originalMethod.apply(this, args);
	};
	return descriptor;
	*/
};
_global.finalProperty = function _finalProperty_Stub_(/*_target:{
													  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
													  constructor:Function;
												  },
												  _propertyKey:PropertyKey*/):void {
	return void 0;
};
_global.final = function _final_(target:{
									 // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
									 constructor:Function;
								 },
								 propertyKey:PropertyKey,
								 descriptor?:PropertyDescriptor):void |
																 any/* eslint-disable-line @typescript-eslint/no-explicit-any */{
	if(descriptor) {
		return _global.finalMethod(target, propertyKey, descriptor);
	}
	return  _global.finalProperty(target, propertyKey);
};

_global.wait ||= function wait(timeMs:number):Promise<void> {
	return new Promise(resolve => setTimeout(resolve, timeMs));
};

_global.logger = console;

// <--- GLOBAL VARS ----
