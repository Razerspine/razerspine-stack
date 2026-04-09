import * as fs from 'node:fs';
import * as path from 'node:path';
import {ConfigOptionType} from '../types';
import {getDefaultScriptEntry} from './normalize-options';

export function validateOptions(options: ConfigOptionType): void {
    if (!options) throw new Error('[build] Options are required.');

    const {mode, scripts, styles, appType = 'spa'} = options;
    const templateType = options.templates?.type ?? 'pug';

    if (mode && !['development', 'production'].includes(mode)) {
        throw new Error(`[build] Invalid mode "${mode}". Expected "development" or "production".`);
    }

    if (scripts && !['js', 'ts'].includes(scripts)) {
        throw new Error(`[build] Invalid scripts option "${scripts}". Expected "js" or "ts".`);
    }

    if (styles && !['scss', 'less'].includes(styles)) {
        throw new Error(`[build] Invalid styles option "${styles}". Expected "scss" or "less".`);
    }

    if (appType && !['spa', 'mpa'].includes(appType)) {
        throw new Error(`[build] Invalid appType "${appType}". Expected "spa" or "mpa".`);
    }

    if (appType === 'mpa' && !options.templates?.entry && templateType !== 'none') {
        throw new Error('[build] templates.entry is required for MPA');
    }

    if (options.templates?.type === 'none' && options.templates?.entry) {
        throw new Error('[build] templates.entry should not be provided when templates.type is "none"');
    }

    if (options.templates?.scriptEntry && templateType !== 'html') {
        throw new Error(
            `[build] templates.scriptEntry is only supported when templates.type is "html".\n` +
            `Current templates.type is "${templateType}". Remove scriptEntry from your config.`
        );
    }

    if (templateType === 'html') {
        const resolvedScriptEntry = path.resolve(
            process.cwd(),
            options.templates?.scriptEntry ?? getDefaultScriptEntry(scripts)
        );

        if (!fs.existsSync(resolvedScriptEntry)) {
            const isCustom = !!options.templates?.scriptEntry;

            if (isCustom) {
                throw new Error(
                    `[build] templates.scriptEntry file not found: "${resolvedScriptEntry}".\n` +
                    `Make sure the file exists or update templates.scriptEntry in your config.`
                );
            } else {
                throw new Error(
                    `[build] templates.type is "html" but no script entry file was found at the default path: "${resolvedScriptEntry}".\n` +
                    `Either create the file or explicitly set templates.scriptEntry in your config:\n\n` +
                    `  templates: {\n` +
                    `    type: 'html',\n` +
                    `    scriptEntry: 'src/app/app.ts',\n` +
                    `  }`
                );
            }
        }
    }
}
