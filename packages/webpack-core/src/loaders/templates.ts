import PugPlugin from 'pug-plugin';
import fs from 'fs';
import {ModeType} from '../types/mode-type';
import {AppType} from '../types/app-type';

export function pugRule() {
    return {
        test: /\.pug$/,
        oneOf: [
            {
                issuer: /\.(js|ts|tsx|jsx)$/,
                loader: PugPlugin.loader,
                options: {
                    method: 'compile',
                },
            },
            {
                loader: PugPlugin.loader,
                options: {
                    method: 'render',
                },
            },
        ],
    };
}

export function templatesLoader(options: {
    entry: string;
    mode: ModeType;
    appType: AppType;
}) {
    const {entry, appType} = options;

    if (!fs.existsSync(entry)) {
        throw new Error(`[webpack-core] Templates entry not found: ${entry}`);
    }

    const stats = fs.statSync(entry);

    if (appType === 'spa' && !stats.isFile()) {
        throw new Error(`[webpack-core] SPA requires a single pug file as templates.entry`);
    }

    if (appType === 'mpa' && !stats.isDirectory()) {
        throw new Error(`[webpack-core] MPA requires templates.entry to be a directory`);
    }

    const pluginEntry = appType === 'spa' ? {index: entry} : entry;

    return [
        new PugPlugin({
            entry: pluginEntry,
            filename: ({chunk}: any) => {
                if (appType === 'spa') {
                    return 'index.html';
                }

                let [name] = chunk.name.split('/');
                if (name === 'home') name = 'index';
                return `${name}.html`;
            },
            js: {
                filename: options.mode === 'production'
                    ? 'js/[name].[contenthash:8].js'
                    : 'js/[name].js',
            },
            css: {
                filename: options.mode === 'production'
                    ? 'css/[name].[contenthash:8].css'
                    : 'css/[name].css',
            }
        }),
    ];
}
