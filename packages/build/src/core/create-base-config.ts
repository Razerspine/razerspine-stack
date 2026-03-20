/**
 * @module create-base-config
 * @description Generates the base Webpack configuration shared across development and production.
 */

import {setConfigMeta} from './config-meta';
import {ConfigOptionType} from '../types';
import {Configuration, RuleSetRule, WebpackPluginInstance} from 'webpack';
import {resolveOptions} from '../options';
import path from 'path';
import {assetsRule, pugRule, scriptsRule, stylesRule} from '../rules';
import {PugTemplatesPlugin} from '../plugins/pug-templates-plugin';

/**
 * Creates a base Webpack configuration object.
 * Also initializes internal metadata (appType) for use in dev/prod overrides.
 *
 * Supports controlled extension/override of internal rules and plugins.
 *
 * @param {ConfigOptionType} options - User-provided options for the build system.
 * @returns {Configuration} The generated base Webpack configuration.
 */
export function createBaseConfig(options: ConfigOptionType): Configuration {
    const normalized = resolveOptions(options);
    const templateType = normalized.templates?.type ?? 'pug';
    /**
     * -----------------------
     * Rules (core pipeline)
     * -----------------------
     */
    let rules: RuleSetRule[] = [
        assetsRule(),
        scriptsRule(normalized),
        stylesRule(normalized),
    ];

    // Conditionally enable pug processing
    if (templateType === 'pug') {
        rules.unshift(pugRule());
    }

    /**
     * Apply user rules overrides/extensions
     */
    if (options.rules?.override) {
        rules = options.rules.override;
    } else if (options.rules?.extend) {
        rules.push(...options.rules.extend);
    }

    /**
     * Plugins (core pipeline)
     */
    let plugins: WebpackPluginInstance[] = [];

    if (templateType === 'pug') {
        if (!normalized.templates.entry) {
            throw new Error('[build] templates.entry is required when templates.type is "pug"');
        }

        plugins.push(
            new PugTemplatesPlugin({
                entry: normalized.templates.entry,
                mode: normalized.mode,
                appType: normalized.appType,
            })
        );
    }

    /**
     * Apply user plugins overrides/extensions
     */
    if (options.plugins?.override) {
        plugins = options.plugins.override;
    } else if (options.plugins?.extend) {
        plugins.push(...options.plugins.extend);
    }

    const config: Configuration = {
        mode: normalized.mode,
        context: process.cwd(),
        output: {
            path: path.join(process.cwd(), 'dist'),
            clean: true,
        },
        module: {
            rules,
        },
        plugins,
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
