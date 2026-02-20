import {ModeType} from './mode-type';
import {ScriptType} from './script-type';
import {StyleType} from './style-type';
import {AppType} from './app-type';
import {Configuration} from 'webpack';

export type ConfigOptionType = {
    mode: ModeType;
    scripts: ScriptType;
    styles: StyleType;
    appType?: AppType;
    templates?: {
        /**
         * Path to pug pages directory
         * @default 'src/views/pages'
         */
        entry?: string;
    };
    /**
     * Webpack resolve config (aliases, extensions, etc.)
     * Passed through to final webpack config
     */
    resolve?: Configuration['resolve']
};
