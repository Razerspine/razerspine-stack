import {ConfigOptionType} from '../types/config-option-type';

export function validateCoreOptions(options: ConfigOptionType): void {
    if (!options) {
        throw new Error('[webpack-core] Options are required.');
    }

    const {mode, scripts, styles, appType = 'mpa'} = options;

    // --- mode
    if (!['development', 'production'].includes(mode)) {
        throw new Error(
            `[webpack-core] Invalid mode "${mode}". Expected "development" or "production".`
        );
    }

    // --- scripts
    if (!['js', 'ts'].includes(scripts)) {
        throw new Error(
            `[webpack-core] Invalid scripts option "${scripts}". Expected "js" or "ts".`
        );
    }

    // --- styles
    if (!['scss', 'less'].includes(styles)) {
        throw new Error(
            `[webpack-core] Invalid styles option "${styles}". Expected "scss" or "less".`
        );
    }

    // --- appType
    if (!['spa', 'mpa'].includes(appType)) {
        throw new Error(
            `[webpack-core] Invalid appType "${appType}". Expected "spa" or "mpa".`
        );
    }
}
