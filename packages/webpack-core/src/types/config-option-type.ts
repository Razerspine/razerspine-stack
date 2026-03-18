import {Configuration} from 'webpack';
import {AppType} from 'app-type';
import {StyleType} from 'style-type';
import {ScriptType} from 'script-type';
import {ModeType} from 'mode-type';

/**
 * Options for configuring the core build process.
 */
export type ConfigOptionType = {
    /** Build mode: 'development' or 'production' */
    mode: ModeType;
    /** Script processing options JavaScript or TypeScript */
    scripts: ScriptType;
    /** Styling processing options SCSS or Less */
    styles: StyleType;
    /** Architecture type: 'spa' (Single Page) or 'mpa' (Multi Page) */
    appType?: AppType;
    /** Configuration for HTML/Pug templates */
    templates?: {
        /**
         * Path to the directory containing Pug pages
         * @default 'src/views/pages'
         */
        entry?: string;
    };
    /**
     * Webpack resolve configuration (aliases, extensions, etc.)
     * This is passed directly to the final Webpack config
     */
    resolve?: Configuration['resolve']
};
