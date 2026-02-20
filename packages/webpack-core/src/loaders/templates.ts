import PugPlugin from 'pug-plugin';
import path from 'path';
import fs from 'fs';
import {ModeType} from '../types/mode-type';
import {AppType} from '../types/app-type';

export function templatesLoader(options: {
    entry?: string;
    mode: ModeType;
    appType?: AppType;
}) {
    const appType = options.appType ?? 'mpa';

    const defaultEntry =
        appType === 'spa'
            ? 'src/views/app.pug'
            : 'src/views/pages';

    const resolvedEntry = path.resolve(
        process.cwd(),
        options.entry ?? defaultEntry
    );

    if (!fs.existsSync(resolvedEntry)) {
        throw new Error(
            `[webpack-core] Templates entry not found: ${resolvedEntry}`
        );
    }

    const stats = fs.statSync(resolvedEntry);

    if (appType === 'spa' && !stats.isFile()) {
        throw new Error(
            `[webpack-core] SPA requires a single pug file as templates.entry`
        );
    }

    if (appType === 'mpa' && !stats.isDirectory()) {
        throw new Error(
            `[webpack-core] MPA requires templates.entry to be a directory`
        );
    }

    return [
        new PugPlugin({
            entry: resolvedEntry,
            loaderOptions: {
                method: 'compile',
            },
            filename: ({chunk}: any) => {
                if (appType === 'spa') {
                    return 'index.html';
                }

                let [name] = chunk.name.split('/');
                if (name === 'home') name = 'index';
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
            }
        }),
    ];
}
