/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: global.d.ts
 * Path: src/
 * Author: alexeygara
 * Last modified: 2026-02-16 19:38
 */

declare type DeepReadonly<T> = { readonly [P in keyof T]:DeepReadonly<T[P]> };

declare type Writeable<T> = { -readonly [P in keyof T]:T[P] };

declare type DeepWriteable<T> = { -readonly [P in keyof T]:DeepWriteable<T[P]> };

declare type DefineRequire<T> = { [P in keyof T]:T[P] | undefined; };

declare type Constructable<TClass> = new (...args:void[]) => TClass;

declare type ConstructableWithArgs<TClass, TArgs> = new (...args:TArgs) => TClass;

declare type OmitProps<T, K extends keyof T> = Pick<T, DiffOfProps<keyof T, K>>;

declare function assertNever(value:never):never;

declare const wait:(milliSeconds:number) => Promise<void>;

// eslint-disable-next-line @typescript-eslint/naming-convention
declare const _global:Global;

declare const logger:ILogger;

interface Global {

	logger:ILogger;

	wait:typeof wait;

}