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
         * Only populated when `templates.type` is `'html'`.
         * Used by `HtmlTemplatesPlugin` to register the webpack entry
         * and by `create-base-config` to wire up the bundle correctly.
         */
        scriptEntry?: string;
        /**
         * Global data passed to all templates at compile time.
         * Currently used by PugTemplatesPlugin as a top-level `data` option of html-bundler-plugin.
         * Supports object (static) or string path to a JSON/JS file (HMR-friendly).
         */
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

    /**
     * Resolve templates entry only when templates system is enabled.
     *
     * Defaults are type-aware:
     * - `type: 'pug'`  → `src/views/app.pug` (SPA) or `src/views/pages` (MPA)
     * - `type: 'html'` → `src/app/index.html` (SPA) or `src/views/pages` (MPA)
     *
     * This prevents a `pug`-specific default from silently passing validation
     * when the project uses `type: 'html'` and omits `templates.entry`.
     */
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
     * Resolve script entry only for `type: 'html'`.
     *
     * For `type: 'pug'`, pug-plugin handles entry resolution internally — no JS entry needed.
     * For `type: 'none'`, the user controls webpack entry entirely.
     *
     * Default follows the `scripts` option:
     * - `scripts: 'ts'` → `src/app/main.ts`
     * - `scripts: 'js'` → `src/app/main.js`
     */
    let scriptEntry: string | undefined;

    if (templatesType === 'html') {
        const defaultScriptEntry = options.scripts === 'ts'
            ? 'src/app/main.ts'
            : 'src/app/main.js';

        scriptEntry = options.templates?.scriptEntry ?? defaultScriptEntry;
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
            scriptEntry: scriptEntry
                ? path.resolve(process.cwd(), scriptEntry)
                : undefined,
            data: options.templates?.data,
        },
        resolve: {
            alias: options.resolve?.alias ?? {},
        },
    };
}
