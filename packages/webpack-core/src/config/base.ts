import {assetsLoader} from '../loaders/assets';
import {scriptsLoader} from '../loaders/scripts';
import {stylesLoader} from '../loaders/styles';
import {templatesLoader} from '../loaders/templates';
import {ModeType} from '../types/mode-type';
import {ConfigOptionType} from '../types/config-option-type';
import path from 'path';
import {validateCoreOptions} from '../validation/validate-core-options';

export function createBaseConfig(options: ConfigOptionType) {
    validateCoreOptions(options);
    const mode: ModeType = options.mode ?? 'development';

    return {
        mode,
        context: process.cwd(),
        output: {
            path: path.join(process.cwd(), 'dist'),
            clean: true,
        },
        module: {
            rules: [
                assetsLoader(),
                scriptsLoader(options),
                stylesLoader(options),
            ],
        },
        plugins: [
            ...templatesLoader({
                entry: options.templates?.entry,
                mode
            }),
        ],
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.json'],
            alias: options.resolve?.alias ?? {}
        },
    };
}
