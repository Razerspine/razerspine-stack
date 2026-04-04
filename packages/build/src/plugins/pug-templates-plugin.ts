import * as fs from 'node:fs';
import path from 'path';
import {Compiler} from 'webpack';
import {ModeType, AppType} from '../types';

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
     * new PugTemplatesPlugin({
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
     * new PugTemplatesPlugin({
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
 * @class PugTemplatesPlugin
 * @description Webpack plugin that configures pug-plugin for Pug-based template rendering.
 *
 * Supports:
 * - SPA mode: single `.pug` entry file → outputs `index.html`
 * - MPA mode: directory of `.pug` files → each file outputs its own `.html`
 * - Global template data via `data` option
 *
 * Requires `pug-plugin` to be installed as a peer dependency.
 * If not installed, a clear actionable error is thrown at build start (not at import time).
 */
export class PugTemplatesPlugin {
    private readonly entry: string;
    private readonly mode: ModeType;
    private readonly appType: AppType;
    private readonly data: Record<string, unknown> | string;

    constructor(options: PugTemplatesPluginOptions) {
        this.entry = path.resolve(options.entry);
        this.mode = options.mode;
        this.appType = options.appType;
        this.data = options.data ?? {};

        this.validate();
    }

    private validate() {
        if (!fs.existsSync(this.entry)) {
            throw new Error(`[build] Templates entry not found: ${this.entry}`);
        }

        const stats = fs.statSync(this.entry);

        if (this.appType === 'spa' && !stats.isFile()) {
            throw new Error(`[build] SPA requires a single pug file as templates.entry`);
        }

        if (this.appType === 'mpa' && !stats.isDirectory()) {
            throw new Error(`[build] MPA requires templates.entry to be a directory`);
        }
    }

    /**
     * Lazily resolves the `pug-plugin` package.
     *
     * Using a lazy require instead of a top-level import ensures that projects
     * using `templates.type: 'html'` are not forced to install `pug-plugin`.
     *
     * @throws {Error} If `pug-plugin` is not installed in the consumer project.
     */
    private resolvePugPlugin() {
        try {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            return require('pug-plugin');
        } catch {
            throw new Error(
                '[build] Missing peer dependency: `pug-plugin`.\n' +
                'Install it with:\n\n' +
                '  npm install -D pug-plugin\n\n' +
                'Required when using `templates.type: "pug"`.'
            );
        }
    }

    apply(compiler: Compiler) {
        const PugPlugin = this.resolvePugPlugin();

        const pluginEntry = this.appType === 'spa' ? {index: this.entry} : this.entry;

        const pugPlugin = new PugPlugin({
            entry: pluginEntry,

            filename: ({chunk}: any) => {
                if (this.appType === 'spa') {
                    return 'index.html';
                }

                let [name] = chunk.name.split('/');

                if (name === 'home') {
                    name = 'index';
                }

                return `${name}.html`;
            },

            js: {
                filename:
                    this.mode === 'production'
                        ? 'js/[name].[contenthash:8].js'
                        : 'js/[name].js',
            },

            css: {
                filename:
                    this.mode === 'production'
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
            data: this.data,
        });

        pugPlugin.apply(compiler);
    }
}
