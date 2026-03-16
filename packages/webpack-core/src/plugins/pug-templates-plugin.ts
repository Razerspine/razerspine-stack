import PugPlugin from 'pug-plugin';
import fs from 'fs';
import path from 'path';
import {Compiler} from 'webpack';
import {ModeType} from '../types/mode-type';
import {AppType} from '../types/app-type';

type PugTemplatesPluginOptions = {
    entry: string;
    mode: ModeType;
    appType: AppType;
};

export class PugTemplatesPlugin {
    private readonly entry: string;
    private readonly mode: ModeType;
    private readonly appType: AppType;

    constructor(options: PugTemplatesPluginOptions) {
        this.entry = path.resolve(options.entry);
        this.mode = options.mode;
        this.appType = options.appType;

        this.validate();
    }

    private validate() {
        if (!fs.existsSync(this.entry)) {
            throw new Error(`[webpack-core] Templates entry not found: ${this.entry}`);
        }

        const stats = fs.statSync(this.entry);

        if (this.appType === 'spa' && !stats.isFile()) {
            throw new Error(`[webpack-core] SPA requires a single pug file as templates.entry`);
        }

        if (this.appType === 'mpa' && !stats.isDirectory()) {
            throw new Error(`[webpack-core] MPA requires templates.entry to be a directory`);
        }
    }

    apply(compiler: Compiler) {
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
        });

        pugPlugin.apply(compiler);
    }
}
