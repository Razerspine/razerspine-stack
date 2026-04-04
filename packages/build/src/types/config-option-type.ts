import {Configuration, RuleSetRule, WebpackPluginInstance} from 'webpack';
import {AppType} from 'app-type';
import {StyleType} from 'style-type';
import {ScriptType} from 'script-type';
import {ModeType} from 'mode-type';
import {TemplatesType} from 'templates-type';
import {BuildPluginType} from 'build-plugin-type';

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
    /**
     * Configuration for HTML/Pug templates
     */
    templates?: {
        /**
         * Template engine type
         * - 'pug'  → uses PugTemplatesPlugin
         * - 'html' → uses HtmlTemplatesPlugin
         * - 'none' → disables template handling (React/Vue/custom setups)
         *
         * @default 'pug'
         */
        type?: TemplatesType;
        /**
         * Path to the templates entry
         *
         * SPA:
         * - single file (e.g. src/views/app.pug / index.html)
         *
         * MPA:
         * - directory with pages
         *
         * @default 'src/views/app.pug' (SPA) or 'src/views/pages' (MPA)
         */
        entry?: string;
        /**
         * Global data passed to all templates at compile time.
         *
         * Currently supported by `templates.type: 'pug'` only.
         * These values are available in every `.pug` file as local variables.
         *
         * Supports two formats:
         * - `object` — static data (requires webpack restart to reflect changes)
         * - `string` — path to a JSON or JS file (supports HMR via webpack watch)
         *
         * @example Object-based:
         * ```ts
         * templates: {
         *   type: 'pug',
         *   entry: 'src/views/pages',
         *   data: {
         *     siteName: 'My App',
         *     version: process.env.npm_package_version,
         *   }
         * }
         * ```
         *
         * @example File-based (HMR-friendly):
         * ```ts
         * templates: {
         *   type: 'pug',
         *   entry: 'src/views/pages',
         *   data: './src/data/site.json',
         * }
         * ```
         *
         * Usage in template:
         * ```pug
         * title= siteName
         * ```
         *
         * @see https://webdiscus.github.io/html-bundler-docs/plugin-options-data
         */
        data?: Record<string, unknown> | string;
    };
    /**
     * Custom Webpack module rules control.
     */
    rules?: {
        /**
         * Extend internal rules (safe).
         * Rules will be appended to the default pipeline.
         */
        extend?: RuleSetRule[];
        /**
         * ⚠️ Overrides ALL internal rules completely.
         *
         * Disables:
         * - assetsRule
         * - scriptsRule
         * - stylesRule
         * - pugRule (if enabled)
         *
         * Use only if you fully control the webpack pipeline.
         */
        override?: RuleSetRule[];
    };
    /**
     * Custom Webpack plugins control.
     */
    plugins?: {
        /**
         * Extend internal plugins (safe).
         * Plugins will be appended after core plugins.
         */
        extend?: WebpackPluginInstance[];
        /**
         * ⚠️ Overrides ALL internal plugins completely.
         *
         * Disables:
         * - PugTemplatesPlugin / HtmlTemplatesPlugin
         * - HostingRoutingPlugin (in production)
         *
         * Use only if you fully control plugin lifecycle.
         */
        override?: WebpackPluginInstance[];
    };
    /**
     * Webpack resolve configuration (aliases, extensions, etc.)
     * This is merged into the final Webpack config.
     */
    resolve?: Configuration['resolve'];
    /**
     * Build plugins (lite extension API)
     *
     * Allows hooking into config generation lifecycle
     * without breaking webpack compatibility.
     *
     * Plugins can:
     * - modify config before/after creation
     * - inject rules/plugins programmatically
     * - extend dev/prod behavior
     *
     * This is NOT a webpack plugin system replacement.
     * It is a higher-level orchestration layer.
     *
     * Example:
     * ```ts
     * {
     *   name: 'react-support',
     *   setup(ctx) {
     *     ctx.hooks.extendConfig.tap(config => {
     *       config.resolve.extensions.push('.jsx', '.tsx');
     *     });
     *   }
     * }
     * ```
     */
    buildPlugins?: BuildPluginType[];
};
