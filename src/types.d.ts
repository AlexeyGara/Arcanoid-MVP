/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: types.d.ts
 * Path: src/
 * Author: alexeygara
 * Last modified: 2026-02-17 15:29
 */

// ---- BASIC TYPES ---> [
declare type ExtBoolean = boolean | "true" | "false" | 1 | 0 | "1" | "0";
declare type ExtBooleanTrue = 	ExtBoolean & (true | "true" | 1 | "1");
declare type ExtBooleanFalse = 	ExtBoolean & (false | "false" | 0 | "0");
declare type PosInfinity = 		Number.POSITIVE_INFINITY;
declare type NegInfinity = 		Number.NEGATIVE_INFINITY;
declare type Infinity = 		PosInfinity | NegInfinity;
declare type NaN = 				Number.NaN | Infinity | null | undefined;
declare type pint4 = 			0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | /*15*/0xF;
declare type pint8 = 			pint4 | 100 | /*127*/0x7F;
declare type pint16 = 			pint8 | 1000 | 10000 | /*32767*/0x7FFF;
declare type pint32 = 			pint16 | 100000 | 1000000 | /*2147483647*/0x7FFFFFFF;
// declare type pint64 = 			pint32 | 9223372036854775807;
declare type uint4 = 			pint4 | /*31*/0x1F;
declare type uint8 = 			uint4 | pint8 | /*255*/0xFF;
declare type uint16 = 			uint8 | pint16 | /*65535*/0xFFFF;
declare type uint32 = 			uint16 | pint32 | /*4294967295*/0xFFFFFFFF;
// declare type uint64 = 			uint32 | pint64 | 18446744073709551615;
declare type int4 = 			pint4 | -1 | -2 | -3 | -4 | -5 | -6 | -7 | -8 | -9 | -10 | -11 | -12 | -13 | -14 | /*-15*/-0xF;
declare type int8 = 			uint4 | int4 | pint8 | -100 | /*-128*/-0x80;
declare type int16 = 			uint8 | int8 | pint16 | -1000 | -10000 | /*-32768*/-0x8000;
declare type int32 = 			uint16 | int16 | pint32 | -100000 | -1000000 | /*-2147483648*/-0x80000000;
// declare type int64 = 			uint32 | int32 | pint64 | -9223372036854775808;
declare type uint = 			/* uint64 | */uint32 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 18446744073709551615/* | Number.MAX_SAFE_INTEGER*/;
declare type int = 				uint/* | int64 */| int32 | -9223372036854775808/* | Number.MIN_SAFE_INTEGER*/;
declare type degrees180 = 		0 | 45 | 90 | 135 | 180 | -45 | -90 | -135;
declare type degrees360 = 		0 | 45 | 90 | 135 | 180 | 225 | 270 | 315;
declare type degrees = 			degrees180 | degrees360;
declare type radians = 			0 | 1.5707963267948966 | 3.141592653589793 | 6.283185307179586 |
								  -1.5707963267948966 | -3.141592653589793;
declare type colorRGB = 		uint16 | int16 | 0x000000 | 0xFFFFFF | 0xFFFF00 | 0xFF00FF | 0xFF0000 | 0x00FF00 | 0x0000FF;
declare type colorARGB = 		uint32 | int32 | 0xFF000000 | 0xFFFFFFFF | 0x00000000 | 0x00FFFFFF |
								0xFFFFFF00 | 0xFF00FFFF | 0xFFFF00FF |
								0xFFFF0000 | 0xFF00FF00 | 0xFF0000FF;
declare type colorRGBA = 		uint32 | int32 | 0x000000FF | 0xFFFFFFFF | 0x00000000 | 0xFFFFFF00 |
								0xFF0000FF | 0x00FF00FF | 0x0000FFFF |
								0xFF000000 | 0x00FF0000 | 0x0000FF00;
declare type ratio = 			0 | 0.1 | 0.25 | 0.3 | 0.5 | 0.7 | 0.75 | 0.9 | 1.0;
declare type alpha = 			ratio | 0.2 | 0.4 | 0.6 | 0.8;
declare type uintMoreZero = 	Exclude<uint, 0>;
declare type numberMoreZero = 	0.1 | 0.25 | 0.3 | 0.5 | 0.7 | 0.75 | 0.9 | 1.0 | 1.1 | 1.5 | 2 | 10 | 100 | 1000;
declare type numberZeroOrMore = numberMoreZero | 0;
declare type numeric = 			uint | int | uintMoreZero | numberMoreZero | numberZeroOrMore | number;
// ] <--- BASIC TYPES ----

//---- PRIMITIVE TYPES ---> [
declare type BasicType = 		string | boolean | uint | int | number;
declare type Something = 		BasicType | object;
declare type EmptyObject = 		object;
declare type PlainObject = 		{ [key: string]: BasicType | PlainObject | Array<BasicType | PlainObject> };
//declare type Dynamic = 			any | null | undefined;

declare type Null = 			null | undefined;
declare type NotNull<T> = 		T extends Null ? never : T;
declare type OrNull<T> = 		T | Null;
declare type Empty = 			Null | NaN;
declare type NotEmpty<T> = 		T extends Empty ? never : T;
declare type OrEmpty<T> = 		T | Empty;

declare type ExtArray<T> = 		Array<T> & { first:() => T|undefined; last:() => T|undefined };
declare type AnyArray = 		Array<never>;
declare type DynamicArray = 	Array<Dynamic>;
declare type SomethingArray = 	Array<Something>;
declare type FixedArray<TLength extends number, T> = Array<T> & { length:TLength };
declare type OrArray<T> = 		T | Array<T>;
declare type AnyFunction<TArgs = never, TReturn = void> =
								(...args:TArgs[]) => TReturn;
declare type EmptyFunction = 	() => void;
declare type NotFunction<T> = 	T extends AnyFunction ? never : T;
declare type AnyGetter<T> = 	() => T;
declare type AnySetter<T> = 	(value:T) => void;

declare type Defined = 			Something | EmptyObject | PlainObject | AnyArray | AnyFunction;

declare type Point<T extends numeric> = 		{ x:T; y:T };
declare type Rectangle<T extends numeric> = 	{ x:T; y:T; width:T; height:T };
declare type Area<T extends numeric> = 			{ x1:T; y1:T; x2:T; y2:T };
declare type Size<T extends numeric> = 			{ width:T; height:T };
declare type Bounds<T extends numeric> = 		{ left:T; right:T; top:T; bottom:T; width:T; height:T };
// ] <--- PRIMITIVE TYPES ----

interface IWebConsole {
	assert(condition:boolean, message:string, ...subStrings:Array<string>):void;
	clear():void;
	count(label?:string):void;
	countReset(label?:string):void;
	debug(message:string, ...subStrings:Array<string>):void;
	dir(object:object):void;
	dirxml(object:object):void;
	error(message:string, ...subStrings:Array<string>):void;
	group(groupTitle?:string):void;
	groupCollapsed(groupTitle?:string):void;
	groupEnd():void;
	info(message:string, ...subStrings:Array<string>):void;
	log(message:string, ...subStrings:Array<string>):void;
	profile?(reportName?:string):void;
	profileEnd?(reportName?:string):void;
	//table(data:PlainObject|Array<PlainObject>, ...dataPropNames:Array<string>):void;
	table(tabularData?:unknown, properties?:string[]):void;
	time(label?:string):void;
	timeEnd(label?:string):void;
	timeLog(label?:string):void;
	timeStamp(label?:string):void;
	timeline?(label?:string):void;
	timelineEnd?(label?:string):void;
	trace(message?:Something|AnyArray, ...optionalParams:AnyArray):void;
	warn(message:string, ...subStrings:Array<string>):void;
}

declare type ILogger = IWebConsole;
/*interface ILogger {
	messagesSplitter:string;

	assert(truthyCondition:boolean, message:OrArray<string>,
		   color?:OrArray<colorRGB>, backgroundColor?:OrArray<colorRGB>, fontStyle?:OrArray<LoggerFontStyle>):this;
	debug(message:OrArray<string>,
		  color?:OrArray<colorRGB>, backgroundColor?:OrArray<colorRGB>, fontStyle?:OrArray<LoggerFontStyle>):this;
	info(message:OrArray<string>,
		 color?:OrArray<colorRGB>, backgroundColor?:OrArray<colorRGB>, fontStyle?:OrArray<LoggerFontStyle>):this;
	log(message:OrArray<string>,
		color?:OrArray<colorRGB>, backgroundColor?:OrArray<colorRGB>, fontStyle?:OrArray<LoggerFontStyle>):this;
	warn(message:OrArray<string>,
		 color?:OrArray<colorRGB>, backgroundColor?:OrArray<colorRGB>, fontStyle?:OrArray<LoggerFontStyle>):this;
	error(messageOrError:OrArray<string> | Error,
		  color?:OrArray<colorRGB>, backgroundColor?:OrArray<colorRGB>, fontStyle?:OrArray<LoggerFontStyle>):this;
	trace(message:Something|AnyArray|Null, ...optionalParams:AnyArray):this;
	alert(message:string|Array<string>):void;
	dir(object:object|Null):this;

	groupStart(label?:string):this;
	groupEnd():this;
}*/
