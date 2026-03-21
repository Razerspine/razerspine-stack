import path from 'path';
import {
    ConfigOptionType,
    AppType,
    ModeType,
    TemplatesType,
    StyleType,
    ScriptType
} from '../types';
import {Configuration} from 'webpack';

export interface NormalizedCoreOptions {
    mode: ModeType;
    appType: AppType;
    scripts: ScriptType;
    styles: StyleType;
    templates: {
        type: TemplatesType;
        entry?: string;
    };
    resolve: NonNullable<Configuration['resolve']>;
}

export function normalizeOptions(
    options: ConfigOptionType
): NormalizedCoreOptions {
    const mode: ModeType = options.mode ?? 'development';
    const appType: AppType = options.appType ?? 'spa';

    const templatesType: TemplatesType = options.templates?.type ?? 'pug';

    /**
     * Resolve templates entry only when templates system is enabled
     */
    let templatesEntry: string | undefined;

    if (templatesType !== 'none') {
        templatesEntry =
            options.templates?.entry ??
            (appType === 'spa'
                ? 'src/views/app.pug'
                : 'src/views/pages');
    }

    return {
        mode,
        appType,
        scripts: options.scripts,
        styles: options.styles,
        templates: {
            type: templatesType,
            entry: templatesEntry
                ? path.resolve(process.cwd(), templatesEntry)
                : undefined,
        },
        resolve: {
            alias: options.resolve?.alias ?? {},
        },
    };
}
