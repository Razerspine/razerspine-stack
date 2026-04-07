import * as fs from 'node:fs';
import path from 'path';
import {Configuration, WebpackPluginInstance} from 'webpack';
import {AppType, BuildPluginType, ModeType} from '../types';

type PugTemplatesPluginOptions = {
    entry: string;
    mode: ModeType;
    appType: AppType;
    /**
     * Global data passed to all Pug templates at compile time.
     *
     * These values are available in every `.pug` file as local variables.
     *
     * Supports two formats:
     * - `object` — static data defined directly in config (no HMR on change, requires webpack restart)
     * - `string` — path to a JSON or JS file; supports HMR via webpack watch
     *
     * @example Object-based (static):
     * ```ts
     * createPugTemplatesPlugin({
     *   entry: 'src/views/pages',
     *   mode: 'production',
     *   appType: 'mpa',
     *   data: {
     *     siteName: 'My App',
     *     version: process.env.npm_package_version,
     *   }
     * })
     * ```
     *
     * @example File-based (HMR-friendly):
     * ```ts
     * createPugTemplatesPlugin({
     *   entry: 'src/views/pages',
     *   mode: 'development',
     *   appType: 'mpa',
     *   data: './src/data/site.json',
     * })
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
 * Lazily resolves the `pug-plugin` package.
 *
 * Using a lazy require instead of a top-level import ensures that projects
 * using `templates.type: 'html'` are not forced to install `pug-plugin`.
 *
 * Handles both native CJS (returns constructor directly) and ESM-interop
 * scenarios (returns `{ default: constructor }`) — the latter occurs in
 * vitest's module system when the mock uses `{ default: MockClass }`.
 *
 * @throws {Error} If `pug-plugin` is not installed in the consumer project.
 */
function resolvePugPlugin() {
    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const mod = require('pug-plugin');
        // Unwrap ESM default export if present (e.g. vitest mock environment)
        return mod?.default ?? mod;
    } catch {
        throw new Error(
            '[build] Missing peer dependency: `pug-plugin`.\n' +
            'Install it with:\n\n' +
            '  npm install -D pug-plugin\n\n' +
            'Required when using `templates.type: "pug"`.'
        );
    }
}

/**
 * Validates the entry path for the given appType.
 *
 * @throws {Error} If entry does not exist or does not match the expected shape
 *   (file for SPA, directory for MPA).
 */
function validateEntry(entry: string, appType: AppType): void {
    if (!fs.existsSync(entry)) {
        throw new Error(`[build] Templates entry not found: ${entry}`);
    }

    const stats = fs.statSync(entry);

    if (appType === 'spa' && !stats.isFile()) {
        throw new Error(`[build] SPA requires a single pug file as templates.entry`);
    }

    if (appType === 'mpa' && !stats.isDirectory()) {
        throw new Error(`[build] MPA requires templates.entry to be a directory`);
    }
}

/**
 * @function createPugTemplatesPlugin
 * @description Internal build plugin factory that wires up `pug-plugin` for Pug-based template rendering.
 *
 * Returns a {@link BuildPluginType} whose `applyBase` hook declaratively pushes the
 * configured `PugPlugin` webpack instance into `config.plugins`.
 * This keeps the plugin visible and dedup-able by the standard `dedupePlugins` pass
 * in `createBaseConfig` — no imperative `.apply(compiler)` calls are needed.
 *
 * Supports:
 * - SPA mode: single `.pug` entry file → outputs `index.html`
 * - MPA mode: directory of `.pug` files → each file outputs its own `.html`,
 *   preserving the full directory structure (e.g. `shop/product.pug` → `shop/product.html`)
 * - Global template data via `data` option
 *
 * Filename convention (MPA only):
 * - A root-level page named exactly `home` is mapped to `index.html` automatically.
 * - All other names, including nested ones, are preserved as-is.
 *
 * Requires `pug-plugin` to be installed as a peer dependency.
 * If not installed, a clear actionable error is thrown during `applyBase` (not at import time).
 */
export function createPugTemplatesPlugin(options: PugTemplatesPluginOptions): BuildPluginType {
    const entry = path.resolve(options.entry);

    // Validate eagerly so the error surfaces before the webpack compilation starts.
    validateEntry(entry, options.appType);

    return {
        name: 'pug-templates',

        /**
         * Declaratively pushes the `PugPlugin` webpack instance into `config.plugins`.
         *
         * Running inside `applyBase` means the instance lands in the same array that
         * `dedupePlugins` will scan at the end of `createBaseConfig` — making it fully
         * visible and replaceable by the user via `plugins.override`.
         *
         * MPA filename resolution:
         * - Preserves the full chunk-name path so nested pages keep their directory structure.
         * - Exception: a bare `'home'` chunk name at the root is remapped to `index.html`.
         */
        applyBase(config: Configuration): void {
            const PugPlugin = resolvePugPlugin();

            const pluginEntry = options.appType === 'spa' ? {index: entry} : entry;

            const pugPlugin = new PugPlugin({
                entry: pluginEntry,

                filename: ({chunk}: any) => {
                    if (options.appType === 'spa') {
                        return 'index.html';
                    }

                    // Preserve the full directory path so nested MPA pages retain their structure.
                    // e.g. chunk name 'shop/product' → 'shop/product.html'
                    //
                    // Convention: a root-level page named exactly 'home' is mapped to 'index.html'
                    // so that `pages/home.pug` becomes the site homepage automatically.
                    // Sub-directory pages (e.g. 'blog/home') are NOT remapped — only the bare 'home' name.
                    const name: string = chunk.name;

                    if (name === 'home') {
                        return 'index.html';
                    }

                    return `${name}.html`;
                },

                js: {
                    filename:
                        options.mode === 'production'
                            ? 'js/[name].[contenthash:8].js'
                            : 'js/[name].js',
                },

                css: {
                    filename:
                        options.mode === 'production'
                            ? 'css/[name].[contenthash:8].css'
                            : 'css/[name].css',
                },

                /**
                 * Global data available in all Pug templates as local variables.
                 *
                 * `data` is a top-level option of HtmlBundlerPlugin (which PugPlugin extends).
                 * It is NOT part of loaderOptions — passing it there has no effect.
                 *
                 * Supports:
                 * - `object` → static data, available immediately (no HMR on change)
                 * - `string` → path to a JSON/JS file, supports HMR via webpack watch
                 *
                 * @see https://webdiscus.github.io/html-bundler-docs/plugin-options-data
                 */
                data: options.data,
            }) as WebpackPluginInstance;

            config.plugins = config.plugins ?? [];
            config.plugins.push(pugPlugin);
        },
    };
}
