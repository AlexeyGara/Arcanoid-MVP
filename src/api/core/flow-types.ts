/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: flow-types.ts
 * Path: src/api/core/
 * Author: alexeygara
 * Last modified: 2026-02-18 09:16
 */

export interface IFlowProcessStartStop {

	start():Promise<void>;

	stop():Promise<void>;
}
