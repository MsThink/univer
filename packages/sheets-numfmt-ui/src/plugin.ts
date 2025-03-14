/**
 * Copyright 2023-present DreamNum Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { IUniverSheetsNumfmtUIConfig } from './controllers/config.schema';
import { DependentOn, IConfigService, Inject, Injector, Plugin, registerDependencies, touchDependencies, UniverInstanceType } from '@univerjs/core';
import { UniverSheetsNumfmtPlugin } from '@univerjs/sheets-numfmt';
import { UniverSheetsUIPlugin } from '@univerjs/sheets-ui';
import { PLUGIN_CONFIG_KEY } from '@univerjs/ui';
import { defaultPluginConfig } from './controllers/config.schema';
import { SheetNumfmtUIController } from './controllers/numfmt.controller';
import { NumfmtEditorController } from './controllers/numfmt.editor.controller';
import { NumfmtMenuController } from './controllers/numfmt.menu.controller';
import { UserHabitController } from './controllers/user-habit.controller';

export const SHEET_NUMFMT_UI_PLUGIN = 'SHEET_NUMFMT_UI_PLUGIN';

@DependentOn(UniverSheetsUIPlugin, UniverSheetsNumfmtPlugin)
export class UniverSheetsNumfmtUIPlugin extends Plugin {
    static override pluginName = SHEET_NUMFMT_UI_PLUGIN;
    static override type = UniverInstanceType.UNIVER_SHEET;

    constructor(
        private readonly _config: Partial<IUniverSheetsNumfmtUIConfig> = defaultPluginConfig,
        @Inject(Injector) override readonly _injector: Injector,
        @IConfigService private readonly _configService: IConfigService
    ) {
        super();

        // Manage the plugin configuration.
        const { menu, ...rest } = this._config;
        if (menu) {
            this._configService.setConfig('menu', menu, { merge: true });
        }

        this._configService.setConfig(PLUGIN_CONFIG_KEY, rest);
    }

    override onStarting(): void {
        registerDependencies(this._injector, [
            [SheetNumfmtUIController],
            [NumfmtEditorController],
            [UserHabitController],
            [NumfmtMenuController],
        ]);
    }

    override onRendered(): void {
        touchDependencies(this._injector, [
            [SheetNumfmtUIController],
            [NumfmtEditorController],
            [NumfmtMenuController],
        ]);
    }
}
