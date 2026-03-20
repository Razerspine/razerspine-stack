import {Configuration, RuleSetRule, WebpackPluginInstance} from 'webpack';
import {AppType} from 'app-type';
import {StyleType} from 'style-type';
import {ScriptType} from 'script-type';
import {ModeType} from 'mode-type';
import {TemplatesType} from 'templates-type';

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
         * Template engine type
         * - 'pug' → uses pug-plugin
         * - 'html' → plain HTML (no pug processing)
         * - 'none' → disables template handling (e.g. React/Vue)
         * @default 'pug'
         */
        type?: TemplatesType;
        /**
         * Path to the templates entry
         * @default 'src/views/app.pug' (SPA) or 'src/views/pages' (MPA)
         */
        entry?: string;
    };
    /**
     * Custom Webpack module rules control.
     */
    rules?: {
        /**
         * Extend internal rules (safe).
         */
        extend?: RuleSetRule[];
        /**
         * ⚠️ Overrides all internal rules completely.
         * Use only if you know what you're doing.
         */
        override?: RuleSetRule[];
    };
    /**
     * Custom Webpack plugins control.
     */
    plugins?: {
        /**
         * Extend internal plugins (safe).
         */
        extend?: WebpackPluginInstance[];

        /**
         * ⚠️ Overrides all internal plugins completely.
         * Use only if you know what you're doing.
         */
        override?: WebpackPluginInstance[];
    };

    /**
     * Webpack resolve configuration (aliases, extensions, etc.)
     * This is passed directly to the final Webpack config
     */
    resolve?: Configuration['resolve']
};
