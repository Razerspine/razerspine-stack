import fs from 'fs';
import path from 'path';
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

    // --- templates entry
    const entryRelative =
        options.templates?.entry ??
        (appType === 'spa'
            ? 'src/views/app.pug'
            : 'src/views/pages');

    const entryAbsolute = path.resolve(process.cwd(), entryRelative);

    if (!fs.existsSync(entryAbsolute)) {
        throw new Error(
            `[webpack-core] Templates entry does not exist: ${entryAbsolute}`
        );
    }

    const stats = fs.statSync(entryAbsolute);

    if (appType === 'mpa' && !stats.isDirectory()) {
        throw new Error(
            `[webpack-core] MPA mode requires templates.entry to be a directory.`
        );
    }

    if (appType === 'spa' && !stats.isFile()) {
        throw new Error(
            `[webpack-core] SPA mode requires templates.entry to be a single pug file.`
        );
    }
}
