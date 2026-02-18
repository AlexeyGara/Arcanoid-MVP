/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: Model.ts
 * Path: src/core/module/
 * Author: alexeygara
 * Last modified: 2026-01-17 14:48
 */

import type {
	IModel,
	LightWeightModelBase
} from "@core-api/module-types";

export abstract class ModelBase<TModelDTO extends LightWeightModelBase = LightWeightModelBase> implements IModel<TModelDTO> {

	abstract readonly destroyed:boolean;

	abstract modelDTO:DeepReadonly<TModelDTO>;

	abstract destroy():void;

}