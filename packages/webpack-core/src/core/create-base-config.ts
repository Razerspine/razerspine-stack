import {setConfigMeta} from './config-meta';
import {ConfigOptionType} from '../types/config-option-type';
import {Configuration} from 'webpack';
import {resolveOptions} from '../options';
import path from 'path';
import {assetsRule, pugRule, scriptsRule, stylesRule} from '../rules';
import {PugTemplatesPlugin} from '../plugins/pug-templates-plugin';

export function createBaseConfig(options: ConfigOptionType): Configuration {
    const normalized = resolveOptions(options);
    const config: Configuration = {
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
    setConfigMeta(config, {
        appType: normalized.appType,
    });

    return config;
}
