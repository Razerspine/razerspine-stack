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
        /**
         * Resolved absolute path to the JS/TS script entry point.
         * Used globally to wire up the bundle correctly in the Webpack-first model.
         */
        scriptEntry?: string;
        data?: Record<string, unknown> | string;
    };
    resolve: NonNullable<Configuration['resolve']>;
}

export function normalizeOptions(
    options: ConfigOptionType
): NormalizedCoreOptions {
    const mode: ModeType = options.mode ?? 'development';
    const appType: AppType = options.appType ?? 'spa';
    const templatesType: TemplatesType = options.templates?.type ?? 'pug';

    let templatesEntry: string | undefined;

    if (templatesType !== 'none') {
        if (options.templates?.entry) {
            templatesEntry = options.templates.entry;
        } else if (appType === 'spa') {
            templatesEntry = templatesType === 'html'
                ? 'src/app/index.html'
                : 'src/views/app.pug';
        } else {
            templatesEntry = 'src/views/pages';
        }
    }

    /**
     * Resolve script entry globally for all templates.
     * Enforces the Webpack-first model where scripts are registered in entry.main.
     */
    const defaultScriptEntry = options.scripts === 'ts'
        ? 'src/app/main.ts'
        : 'src/app/main.js';

    const scriptEntry = options.templates?.scriptEntry ?? defaultScriptEntry;

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
            scriptEntry: path.resolve(process.cwd(), scriptEntry),
            data: options.templates?.data,
        },
        resolve: {
            alias: options.resolve?.alias ?? {},
        },
    };
}
