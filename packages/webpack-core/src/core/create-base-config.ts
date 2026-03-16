import path from 'path';
import {ConfigOptionType} from '../types/config-option-type';
import {LoaderOptionsPlugin} from 'webpack';
import {pugRule} from '../rules/pug-rule';
import {assetsRule} from '../rules/assets-rule';
import {scriptsRule} from '../rules/scripts-rule';
import {stylesRule} from '../rules/styles-rule';
import {PugTemplatesPlugin} from '../plugins/pug-templates-plugin';
import {resolveOptions} from '../options';

export function createBaseConfig(options: ConfigOptionType) {
    const normalized = resolveOptions(options);

    return {
        mode: normalized.mode,
        context: process.cwd(),
        output: {
            path: path.join(process.cwd(), 'dist'),
            clean: true,
        },
        module: {
            rules: [
                pugRule(),
                assetsRule(),
                scriptsRule(normalized),
                stylesRule(normalized),
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
            new PugTemplatesPlugin({
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
