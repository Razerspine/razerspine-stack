import * as fs from 'node:fs';
import path from 'path';
import {Compiler} from 'webpack';
import {ModeType, AppType} from '../types';

type HtmlTemplatesPluginOptions = {
    entry: string;
    mode: ModeType;
    appType: AppType;
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
 * Supports:
 * - SPA mode: single `.html` entry file → outputs `index.html`
 * - MPA mode: directory of `.html` files → each file outputs its own `.html`
 * - Global template data via `data` option (injected via `templateParameters` function)
 *
 * Requires `html-webpack-plugin` to be installed as a peer dependency.
 * If not installed, a clear actionable error is thrown at build start (not at import time).
 */
export class HtmlTemplatesPlugin {
    private readonly entry: string;
    private readonly mode: ModeType;
    private readonly appType: AppType;
    private readonly data: Record<string, unknown>;

    constructor(options: HtmlTemplatesPluginOptions) {
        this.entry = path.resolve(options.entry);
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
     * Using a lazy require instead of a top-level import ensures that projects
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
