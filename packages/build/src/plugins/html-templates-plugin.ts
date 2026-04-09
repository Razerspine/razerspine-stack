import * as fs from 'node:fs';
import path from 'path';
import {Configuration, WebpackPluginInstance} from 'webpack';
import {AppType, BuildPluginType, ModeType} from '../types';
import {markPlugin, getHtmlFiles} from '../utils';

type HtmlTemplatesPluginOptions = {
    entry: string;
    mode: ModeType;
    appType: AppType;
    /**
     * Absolute path to the JS/TS script entry point.
     *
     * Registered as the Webpack `entry` so that the script bundle is built
     * and automatically injected into the output HTML by `html-webpack-plugin`.
     *
     * Resolved and validated upstream by `normalizeOptions` and `validateOptions`.
     * Always present when `templates.type` is `'html'`.
     *
     * @example
     * Resolves to the absolute path of `src/app/main.ts` or a user-provided path.
     */
    scriptEntry: string;
    /**
     * Custom data passed to all HTML templates at compile time.
     *
     * ⚠️ Important: `html-webpack-plugin` does NOT have a global `data` option like `pug-plugin`.
     * Data is injected via `templateParameters` as a **function** that merges user data
     * with the default plugin parameters (`htmlWebpackPlugin`, `webpackConfig`, etc.).
     *
     * Passing `templateParameters` as a plain object would overwrite the defaults —
     * which breaks access to `htmlWebpackPlugin.tags`, `htmlWebpackPlugin.files`, etc.
     * That's why we always use the function form internally.
     *
     * Variables are accessed in templates via EJS syntax (default html-webpack-plugin engine):
     *
     * @example Config:
     * ```ts
     * createHtmlTemplatesPlugin({
     *   entry: 'src/views/pages',
     *   scriptEntry: '/abs/path/to/src/app/main.ts',
     *   mode: 'production',
     *   appType: 'mpa',
     *   data: {
     *     siteName: 'My App',
     *     version: process.env.npm_package_version,
     *   }
     * })
     * ```
     *
     * @example Usage in template (EJS):
     * ```html
     * <title><%= siteName %></title>
     * <meta name="version" content="<%= version %>">
     * ```
     *
     * @see https://github.com/jantimon/html-webpack-plugin#writing-your-own-templates
     */
    data?: Record<string, unknown>;
};

/**
 * Lazily resolves the `html-webpack-plugin` package.
 *
 * Using a lazy requirement instead of a top-level import ensures that projects
 * using `templates.type: 'pug'` are not forced to install `html-webpack-plugin`.
 *
 * Handles both native CJS (returns constructor directly) and ESM-interop
 * scenarios (returns `{ default: constructor }`) — the latter occurs in
 * vitest's module system when the mock uses `{ default: MockClass }`.
 *
 * @throws {Error} If `html-webpack-plugin` is not installed in the consumer project.
 */
function resolveHtmlPlugin() {
    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const mod = require('html-webpack-plugin');
        // Unwrap ESM default export if present (e.g. vitest mock environment)
        return mod?.default ?? mod;
    } catch {
        throw new Error(
            '[build] Missing peer dependency: `html-webpack-plugin`.\n' +
            'Install it with:\n\n' +
            '  npm install -D html-webpack-plugin\n\n' +
            'Required when using `templates.type: "html"`.'
        );
    }
}

/**
 * Lazily resolves the `mini-css-extract-plugin` package.
 *
 * Only loaded in production mode. In development, `style-loader` (registered via
 * `htmlStylesRule`) injects CSS into the DOM directly — no extraction plugin needed.
 *
 * @throws {Error} If `mini-css-extract-plugin` is not installed in the consumer project.
 */
function resolveMiniCssExtractPlugin() {
    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const mod = require('mini-css-extract-plugin');
        return mod?.default ?? mod;
    } catch {
        throw new Error(
            '[build] Missing peer dependency: `mini-css-extract-plugin`.\n' +
            'Install it with:\n\n' +
            '  npm install -D mini-css-extract-plugin\n\n' +
            'Required when using `templates.type: "html"` in production mode.'
        );
    }
}

/**
 * Builds a `templateParameters` function that safely merges user `data`
 * with the default html-webpack-plugin parameters.
 *
 * Using a **function** instead of a plain object is required to preserve
 * the default params (`htmlWebpackPlugin`, `webpackConfig`, `compilation`).
 * Passing a plain object overwrites all defaults — a known html-webpack-plugin gotcha.
 *
 * @see https://github.com/jantimon/html-webpack-plugin/issues/1117
 */
function buildTemplateParameters(userData: Record<string, unknown>) {
    return (
        compilation: unknown,
        assets: unknown,
        assetTags: unknown,
        options: unknown
    ) => ({
        compilation,
        webpackConfig: (compilation as any).options,
        htmlWebpackPlugin: {
            tags: assetTags,
            files: assets,
            options,
        },
        ...userData,
    });
}

/**
 * Validates the entry path for the given appType.
 *
 * @throws {Error} If entry does not exist or does not match the expected shape
 *   (file for SPA, directory for MPA).
 */
function validateEntry(entry: string, appType: AppType): void {
    if (!fs.existsSync(entry)) {
        throw new Error(`[build] HTML templates entry not found: ${entry}`);
    }

    const stats = fs.statSync(entry);

    if (appType === 'spa' && !stats.isFile()) {
        throw new Error(`[build] SPA requires a single HTML file as templates.entry`);
    }

    if (appType === 'mpa' && !stats.isDirectory()) {
        throw new Error(`[build] MPA requires templates.entry to be a directory`);
    }
}

/**
 * @function createHtmlTemplatesPlugin
 * @description Internal build plugin factory that wires up `html-webpack-plugin` for HTML-based template rendering.
 *
 * Returns a {@link BuildPluginType} whose `applyBase` hook declaratively:
 * - Guards `entry.main` — does not overwrite it if already set by `createBaseConfig`.
 * - Pushes `MiniCssExtractPlugin` into `config.plugins` in production mode.
 * - Pushes one or more `HtmlWebpackPlugin` instances into `config.plugins`.
 *
 * All pushed instances are tagged via {@link markPlugin} so `dedupePlugins` can identify
 * and remove exact duplicates (including untagged user-supplied instances of the same class
 * added via `plugins.extend`) without relying on `constructor.name` or private plugin options.
 *
 * All mutations happen on the plain `Configuration` object inside `applyBase`,
 * so every pushed plugin is visible to the standard `dedupePlugins` pass
 * at the end of `createBaseConfig` and can be replaced by the user via `plugins.override`.
 *
 * Supports:
 * - SPA mode: single `.html` entry file → outputs `index.html`
 * - MPA mode: directory of `.html` files → each file outputs its own `.html`
 * - Global template data via `data` option (injected via `templateParameters` function)
 *
 * Requires `html-webpack-plugin` to be installed as a peer dependency.
 * If not installed, a clear actionable error is thrown during `applyBase` (not at import time).
 */
export function createHtmlTemplatesPlugin(options: HtmlTemplatesPluginOptions): BuildPluginType {
    const entry = path.resolve(options.entry);
    const data = options.data ?? {};

    // Validate eagerly so the error surfaces before the webpack compilation starts.
    validateEntry(entry, options.appType);

    return {
        name: 'html-templates',

        /**
         * Declaratively mutates the base `Configuration` object:
         *
         * 1. Guards `entry.main` — only writes it when absent, so the value set
         *    by `createBaseConfig` (for `type: 'html'`) or by an earlier
         *    `buildPlugin.applyBase` hook is never overwritten.
         *
         * 2. Pushes `MiniCssExtractPlugin` into `config.plugins` (production only),
         *    tagged via {@link markPlugin}.
         *    In development, `style-loader` from `htmlStylesRule` handles CSS injection —
         *    no extraction plugin is needed.
         *
         * 3. Pushes `HtmlWebpackPlugin` instance(s) into `config.plugins`, each tagged
         *    via {@link markPlugin}:
         *    - SPA → one instance targeting `entry` → `index.html`
         *    - MPA → one instance per `.html` file in the `entry` directory
         *
         * All pushed instances land in `config.plugins` before `dedupePlugins` runs,
         * so the user can safely replace them via `plugins.override`.
         */
        applyBase(config: Configuration): void {
            config.plugins = config.plugins ?? [];

            /**
             * Guard: only set `entry.main` when it has not already been set.
             *
             * `createBaseConfig` writes `entry.main` from `normalized.templates.scriptEntry`
             * before this hook runs for `type: 'html'` — so under normal conditions this
             * block is a no-op. It exists as a safety net for edge cases where `config.entry`
             * arrives in an unexpected shape.
             *
             * Safety: webpack `entry` can be a string, array, object, or function.
             * We only spread when it is a plain object. Any other format (string, array,
             * function) is replaced with `{ main: ... }` because it cannot be merged safely.
             */
            const existingEntry = config.entry;
            const isPlainObject =
                existingEntry !== null &&
                typeof existingEntry === 'object' &&
                !Array.isArray(existingEntry) &&
                typeof existingEntry !== 'function';

            const baseEntry = isPlainObject ? (existingEntry as Record<string, unknown>) : {};

            if (!('main' in baseEntry)) {
                config.entry = {
                    ...baseEntry,
                    main: {
                        import: [options.scriptEntry],
                    },
                };
            }

            /**
             * MiniCssExtractPlugin (production only).
             *
             * In production, `htmlStylesRule` uses `MiniCssExtractPlugin.loader` to extract
             * CSS into a separate file. The plugin itself must also be present to emit
             * the `.css` asset and let `html-webpack-plugin` inject the `<link>` tag.
             *
             * Tagged with {@link markPlugin} so `dedupePlugins` can detect exact duplicates
             * (including untagged user-supplied copies added via `plugins.extend`).
             */
            if (options.mode === 'production') {
                const MiniCssExtractPlugin = resolveMiniCssExtractPlugin();

                config.plugins.push(
                    markPlugin(new MiniCssExtractPlugin({
                        filename: 'css/[name].[contenthash:8].css',
                    }) as WebpackPluginInstance)
                );
            }

            /**
             * HtmlWebpackPlugin instance(s).
             *
             * Each instance is tagged with {@link markPlugin} and pushed into `config.plugins`
             * so it is visible for precise deduplication (including removal of untagged copies
             * of the same class added via `plugins.extend`) and can be replaced by the user
             * via `plugins.override`.
             */
            const HtmlWebpackPlugin = resolveHtmlPlugin();

            const templateParameters = Object.keys(data).length > 0
                ? buildTemplateParameters(data)
                : undefined;

            if (options.appType === 'spa') {
                config.plugins.push(
                    markPlugin(new HtmlWebpackPlugin({
                        template: entry,
                        filename: 'index.html',
                        minify: options.mode === 'production',
                        ...(templateParameters && {templateParameters}),
                    }) as WebpackPluginInstance)
                );

                return;
            }

            /**
             * Recursively collect all .html files under the entry directory.
             *
             * `getHtmlFiles` performs a deep scan, so nested MPA structures like
             * `src/views/pages/about/index.html` are correctly included.
             */
            const files = getHtmlFiles(entry);

            files.forEach(filePath => {
                // Normalize to POSIX separators before parsing so path.posix.parse
                // works correctly on Windows where path.relative() uses backslashes.
                const relPath = path.relative(entry, filePath).replace(/\\/g, '/');
                const parsedPath = path.posix.parse(relPath);

                let filename = relPath;

                /**
                 * Smart routing normalizations:
                 * - Any file named 'home' → 'index.html' (site root)
                 * - Any file named '404'  → '404.html'   (error page at root)
                 * - Redundant dir/file pairs (e.g. 'about/about.html') → 'about.html'
                 *
                 * Uses path.posix.basename() instead of endsWith() to avoid false positives
                 * where the file name is a suffix of the directory name
                 * (e.g. 'my-layout/out.html': "my-layout".endsWith("out") → true, incorrect).
                 */
                if (parsedPath.name === 'home') {
                    filename = 'index.html';
                } else if (parsedPath.name === '404') {
                    filename = '404.html';
                } else if (parsedPath.dir && path.posix.basename(parsedPath.dir) === parsedPath.name) {
                    filename = `${parsedPath.dir}.html`;
                }

                (config.plugins as WebpackPluginInstance[]).push(
                    markPlugin(new HtmlWebpackPlugin({
                        template: filePath,
                        filename,
                        minify: options.mode === 'production',
                        ...(templateParameters && {templateParameters}),
                    }) as WebpackPluginInstance)
                );
            });
        },
    };
}
