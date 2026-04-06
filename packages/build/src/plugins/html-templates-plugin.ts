import * as fs from 'node:fs';
import path from 'path';
import {Compiler} from 'webpack';
import {ModeType, AppType} from '../types';

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
     * new HtmlTemplatesPlugin({
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
 * @class HtmlTemplatesPlugin
 * @description Webpack plugin that configures html-webpack-plugin for HTML-based template rendering.
 *
 * Responsibilities:
 * - Registers the JS/TS `scriptEntry` as the Webpack entry point so the bundle is built
 *   and injected into the output HTML automatically by `html-webpack-plugin`.
 * - In production mode, registers `MiniCssExtractPlugin` so CSS imported from the script
 *   entry is extracted into a separate `.css` file and injected into HTML.
 * - Configures `html-webpack-plugin` for:
 *   - SPA mode: single `.html` entry file → outputs `index.html`
 *   - MPA mode: directory of `.html` files → each file outputs its own `.html`
 * - Supports global template data via `data` option (injected via `templateParameters` function).
 *
 * Requires `html-webpack-plugin` to be installed as a peer dependency.
 * If not installed, a clear actionable error is thrown at build start (not at import time).
 */
export class HtmlTemplatesPlugin {
    private readonly entry: string;
    private readonly scriptEntry: string;
    private readonly mode: ModeType;
    private readonly appType: AppType;
    private readonly data: Record<string, unknown>;

    constructor(options: HtmlTemplatesPluginOptions) {
        this.entry = path.resolve(options.entry);
        this.scriptEntry = options.scriptEntry;
        this.mode = options.mode;
        this.appType = options.appType;
        this.data = options.data ?? {};

        this.validate();
    }

    private validate() {
        if (!fs.existsSync(this.entry)) {
            throw new Error(`[build] HTML templates entry not found: ${this.entry}`);
        }

        const stats = fs.statSync(this.entry);

        if (this.appType === 'spa' && !stats.isFile()) {
            throw new Error(`[build] SPA requires a single HTML file as templates.entry`);
        }

        if (this.appType === 'mpa' && !stats.isDirectory()) {
            throw new Error(`[build] MPA requires templates.entry to be a directory`);
        }
    }

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
    private resolveHtmlPlugin() {
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
    private resolveMiniCssExtractPlugin() {
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
    private buildTemplateParameters(userData: Record<string, unknown>) {
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

    apply(compiler: Compiler) {
        /**
         * Register the JS/TS script entry into the Webpack entry configuration.
         *
         * `html-webpack-plugin` only generates HTML — it does not create a script bundle.
         * Webpack needs an explicit JS/TS entry to build the bundle that gets injected.
         *
         * We use the `entryName: 'main'` convention so `html-webpack-plugin` picks it up
         * automatically and injects the resulting script tag into the output HTML.
         *
         * Safety: webpack `entry` can be a string, array, object, or function.
         * We only spread when it is a plain object — all other formats are replaced
         * with a new object that contains the `main` entry, because they are not
         * compatible with the object spread pattern and indicate an unexpected external
         * configuration which HtmlTemplatesPlugin cannot safely merge with.
         */
        const existingEntry = compiler.options.entry;
        const isPlainObject =
            existingEntry !== null &&
            typeof existingEntry === 'object' &&
            !Array.isArray(existingEntry) &&
            typeof existingEntry !== 'function';

        compiler.options.entry = {
            ...(isPlainObject ? (existingEntry as object) : {}),
            main: {
                import: [this.scriptEntry],
            },
        };

        /**
         * Register MiniCssExtractPlugin in production mode.
         *
         * In production, `htmlStylesRule` uses `MiniCssExtractPlugin.loader` to extract
         * CSS into a separate file. The plugin itself must also be registered to emit
         * the `.css` asset and let `html-webpack-plugin` inject the `<link>` tag.
         *
         * In development, `style-loader` injects CSS via `<style>` tags at runtime —
         * no extraction plugin is needed.
         */
        if (this.mode === 'production') {
            const MiniCssExtractPlugin = this.resolveMiniCssExtractPlugin();

            new MiniCssExtractPlugin({
                filename: 'css/[name].[contenthash:8].css',
            }).apply(compiler);
        }

        const HtmlWebpackPlugin = this.resolveHtmlPlugin();

        const templateParameters = Object.keys(this.data).length > 0
            ? this.buildTemplateParameters(this.data)
            : undefined;

        if (this.appType === 'spa') {
            new HtmlWebpackPlugin({
                template: this.entry,
                filename: 'index.html',
                minify: this.mode === 'production',
                ...(templateParameters && {templateParameters}),
            }).apply(compiler);

            return;
        }

        const files = fs.readdirSync(this.entry).filter(f => f.endsWith('.html'));

        files.forEach(file => {
            const name = path.basename(file, '.html');

            new HtmlWebpackPlugin({
                template: path.join(this.entry, file),
                filename: `${name}.html`,
                minify: this.mode === 'production',
                ...(templateParameters && {templateParameters}),
            }).apply(compiler);
        });
    }
}
