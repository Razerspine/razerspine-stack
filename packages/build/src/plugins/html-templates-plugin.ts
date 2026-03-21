import HtmlWebpackPlugin from 'html-webpack-plugin';
import * as fs from 'node:fs';
import path from 'path';
import {Compiler} from 'webpack';
import {ModeType, AppType} from '../types';

type HtmlTemplatesPluginOptions = {
    entry: string;
    mode: ModeType;
    appType: AppType;
};

export class HtmlTemplatesPlugin {
    private readonly entry: string;
    private readonly mode: ModeType;
    private readonly appType: AppType;

    constructor(options: HtmlTemplatesPluginOptions) {
        this.entry = path.resolve(options.entry);
        this.mode = options.mode;
        this.appType = options.appType;

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

    apply(compiler: Compiler) {
        if (this.appType === 'spa') {
            new HtmlWebpackPlugin({
                template: this.entry,
                filename: 'index.html',
                minify: this.mode === 'production'
            }).apply(compiler);

            return;
        }

        const files = fs.readdirSync(this.entry).filter(f => f.endsWith('.html'));

        files.forEach(file => {
            const name = path.basename(file, '.html');

            new HtmlWebpackPlugin({
                template: path.join(this.entry, file),
                filename: `${name}.html`,
                minify: this.mode === 'production'
            }).apply(compiler);
        });
    }
}
