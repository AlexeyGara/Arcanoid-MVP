/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: app-types.ts
 * Path: src/api/app/
 * Author: alexeygara
 * Last modified: 2026-02-17 16:42
 */

import type { IResizeManager }  from "@core-api/service-types";
import type { SystemsProvider } from "@core-api/system-types";

export type AppContext = DeepReadonly<{

	systems:{
		pause:SystemsProvider['pauseManager'];
		actions:SystemsProvider['actionsManager'];
		animations:SystemsProvider['animationsManager'];
		sounds:SystemsProvider['soundsManager'];
		music:SystemsProvider['musicManager'];
	};

	services:{
		resize:Pick<IResizeManager, 'addListener' | 'removeListener'>;
	};

}>;