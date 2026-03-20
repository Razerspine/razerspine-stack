import {ConfigOptionType} from '../types';

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

    if (options.templates?.type === 'none' && options.templates?.entry) {
        throw new Error('[build] templates.entry should not be provided when templates.type is "none"');
    }

    if (appType === 'mpa' && templateType !== 'none' && !options.templates?.entry) {
        throw new Error('[build] templates.entry is required for MPA when templates are enabled');
    }
}
