/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: AppFlowController.ts
 * Path: src/app/flow/
 * Author: alexeygara
 * Last modified: 2026-02-18 17:24
 */

import type { AppContext } from "@app-api/app-types";
import type { AppEvent }   from "app/event/events";
import type { AppSTATEid } from "app/state/states";
import { FlowController }  from "core/flow/FlowController";

export class AppFlowController extends FlowController<AppSTATEid, AppEvent, AppContext> {


}