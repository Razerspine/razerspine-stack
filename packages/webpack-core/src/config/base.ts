import path from 'path';
import {assetsLoader} from '../loaders/assets';
import {scriptsLoader} from '../loaders/scripts';
import {stylesLoader} from '../loaders/styles';
import {templatesLoader} from '../loaders/templates';
import {ConfigOptionType} from '../types/config-option-type';
import {validateCoreOptions} from '../validation/validate-core-options';
import {normalizeCoreOptions} from '../utils/normalize-core-options';
import {LoaderOptionsPlugin, webpack} from 'webpack';

export function createBaseConfig(options: ConfigOptionType) {
    validateCoreOptions(options);
    const normalized = normalizeCoreOptions(options);

    return {
        mode: normalized.mode,
        context: process.cwd(),
        output: {
            path: path.join(process.cwd(), 'dist'),
            clean: true,
        },
        module: {
            rules: [
                assetsLoader(),
                scriptsLoader(normalized),
                stylesLoader(normalized),
            ],
        },
        plugins: [
            new LoaderOptionsPlugin({
                options: {
                    _meta: {
                        appType: normalized.appType,
                    }
                }
            }),
            ...templatesLoader({
                entry: normalized.templates.entry,
                mode: normalized.mode,
                appType: normalized.appType,
            }),
        ],
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.json'],
            alias: normalized.resolve.alias,
        },
    };
}
