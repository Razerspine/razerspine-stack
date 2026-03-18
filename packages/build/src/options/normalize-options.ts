import path from 'path';
import {ConfigOptionType, AppType, ModeType} from '../types';
import {Configuration} from 'webpack';

export interface NormalizedCoreOptions {
    mode: ModeType;
    appType: AppType;
    scripts: 'js' | 'ts';
    styles: 'scss' | 'less';
    templates: {
        entry: string;
    };
    resolve: NonNullable<Configuration['resolve']>;
}

export function normalizeOptions(
    options: ConfigOptionType
): NormalizedCoreOptions {
    const mode: ModeType = options.mode ?? 'development';
    const appType: AppType = options.appType ?? 'spa';
    const templatesEntry = options.templates?.entry ?? (appType === 'spa' ? 'src/views/app.pug' : 'src/views/pages');

    return {
        mode,
        appType,
        scripts: options.scripts,
        styles: options.styles,
        templates: {
            entry: path.resolve(process.cwd(), templatesEntry),
        },
        resolve: {
            alias: options.resolve?.alias ?? {},
        },
    };
}
