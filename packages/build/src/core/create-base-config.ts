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
import {HtmlTemplatesPlugin} from '../plugins/html-templates-plugin';
import {dedupePlugins, dedupeRules} from '../utils';

/**
 * Creates a base Webpack configuration object.
 * Also initializes internal metadata (appType) for use in dev/prod overrides.
 *
 * Supports controlled extension/override of internal rules and plugins.
 *
 * ---
 * Template system:
 *
 * The build system supports multiple template engines via `templates.type`:
 *
 * - `pug`  → uses PugTemplatesPlugin (default)
 * - `html` → uses HtmlTemplatesPlugin
 * - `none` → disables template handling (React/Vue/custom setups)
 *
 * This allows flexible integration with different rendering strategies.
 *
 * ---
 * Rules system:
 *
 * Internal rules pipeline:
 * - assets
 * - scripts (js/ts)
 * - styles (scss/less)
 * - pug (only when enabled)
 *
 * Users can:
 * - extend rules safely (`rules.extend`)
 * - fully override rules (`rules.override`)
 *
 * ---
 * 🔌 Plugins system:
 *
 * Internal plugins are conditionally applied based on template type.
 *
 * Users can:
 * - extend plugins (`plugins.extend`)
 * - override plugins completely (`plugins.override`)
 *
 * ⚠️ Override should be used with caution — it disables all internal plugins.
 *
 * ---
 * @param {ConfigOptionType} options - User-provided options for the build system.
 * @returns {Configuration} The generated base Webpack configuration.
 */
export function createBaseConfig(options: ConfigOptionType): Configuration {
    const normalized = resolveOptions(options);
    const templateType = normalized.templates?.type ?? 'pug';
    /**
     * Rules (core pipeline)
     */
    let rules: RuleSetRule[] = [
        assetsRule(),
        scriptsRule(normalized),
        stylesRule(normalized),
    ];

    /**
     * Conditionally enable pug processing
     */
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

    /**
     * PUG templates support
     */
    if (templateType === 'pug') {
        if (!normalized.templates.entry) {
            throw new Error('[build] templates.entry is required when templates.type is "pug"');
        }

        plugins.push(
            new PugTemplatesPlugin({
                entry: normalized.templates.entry,
                mode: normalized.mode,
                appType: normalized.appType,
                data: normalized.templates.data,
            })
        );
    }

    /**
     * HTML templates support (HtmlWebpackPlugin wrapper)
     */
    if (templateType === 'html') {
        if (!normalized.templates.entry) {
            throw new Error('[build] templates.entry is required when templates.type is "html"');
        }

        plugins.push(
            new HtmlTemplatesPlugin({
                entry: normalized.templates.entry,
                mode: normalized.mode,
                appType: normalized.appType,
                data: normalized.templates.data as Record<string, unknown> | undefined,
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
        plugins: dedupePlugins(plugins),
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.json'],
            alias: normalized.resolve.alias,
        },
    };

    /**
     * Build Plugins (lifecycle)
     *
     * These are NOT webpack plugins.
     * They are internal framework plugins used to extend config behavior.
     */
    const buildPlugins = options.buildPlugins ?? [];

    // Run setup phase
    for (const plugin of buildPlugins) {
        plugin.setup?.({options: normalized});
    }

    // Apply base config hooks
    for (const plugin of buildPlugins) {
        plugin.applyBase?.(config);
    }

    /**
     * Re-dedupe rules after buildPlugins mutations
     */
    if (config.module?.rules) {
        config.module.rules = dedupeRules(config.module.rules as RuleSetRule[]);
    }

    /**
     * Re-dedupe plugins after buildPlugins mutations
     */
    if (config.plugins) {
        config.plugins = dedupePlugins(config.plugins as WebpackPluginInstance[]);
    }

    /**
     * Store metadata (appType + buildPlugins)
     */
    setConfigMeta(config, {
        appType: normalized.appType,
        buildPlugins,
    });

    return config;
}
