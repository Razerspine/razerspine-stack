/**
 * @module create-base-config
 * @description Generates the base Webpack configuration shared across development and production.
 */

import {setConfigMeta} from './config-meta';
import {ConfigOptionType} from '../types';
import {Configuration} from 'webpack';
import {resolveOptions} from '../options';
import path from 'path';
import {assetsRule, pugRule, scriptsRule, stylesRule} from '../rules';
import {PugTemplatesPlugin} from '../plugins/pug-templates-plugin';

/**
 * Creates a base Webpack configuration object.
 * Also initializes internal metadata (appType) for use in dev/prod overrides.
 * * @param {ConfigOptionType} options - User-provided options for the build system.
 * @returns {Configuration} The generated base Webpack configuration.
 */
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

    // Store app metadata for later retrieval in dev/prod config creators
    setConfigMeta(config, {
        appType: normalized.appType,
    });

    return config;
}
