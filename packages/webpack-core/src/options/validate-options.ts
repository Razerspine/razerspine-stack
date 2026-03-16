import {ConfigOptionType} from '../types/config-option-type';

export function validateOptions(options: ConfigOptionType): void {
    if (!options) {
        throw new Error('[webpack-core] Options are required.');
    }

    const {mode, scripts, styles, appType = 'mpa'} = options;

    if (!['development', 'production'].includes(mode)) {
        throw new Error(
            `[webpack-core] Invalid mode "${mode}". Expected "development" or "production".`
        );
    }

    if (!['js', 'ts'].includes(scripts)) {
        throw new Error(
            `[webpack-core] Invalid scripts option "${scripts}". Expected "js" or "ts".`
        );
    }

    if (!['scss', 'less'].includes(styles)) {
        throw new Error(
            `[webpack-core] Invalid styles option "${styles}". Expected "scss" or "less".`
        );
    }

    if (!['spa', 'mpa'].includes(appType)) {
        throw new Error(
            `[webpack-core] Invalid appType "${appType}". Expected "spa" or "mpa".`
        );
    }
}
