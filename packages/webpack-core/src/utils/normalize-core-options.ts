import path from 'path';
import {ConfigOptionType} from '../types/config-option-type';
import {AppType} from '../types/app-type';
import {ModeType} from '../types/mode-type';
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

export function normalizeCoreOptions(
    options: ConfigOptionType
): NormalizedCoreOptions {
    const mode: ModeType = options.mode ?? 'development';
    const appType: AppType = options.appType ?? 'mpa';

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
