/**
 * @module create-base-config
 * @description Generates the base Webpack configuration shared across development and production.
 */

import {setConfigMeta} from './config-meta';
import {ConfigOptionType} from '../types';
import {Configuration, RuleSetRule, WebpackPluginInstance} from 'webpack';
import {resolveOptions} from '../options';
import path from 'path';
import {assetsRule, htmlRule, htmlStylesRule, pugRule, scriptsRule, stylesRule} from '../rules';
import {createPugTemplatesPlugin} from '../plugins/pug-templates-plugin';
import {createHtmlTemplatesPlugin} from '../plugins/html-templates-plugin';
import {BuildPluginType} from '../types';
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
 * - `pug`  → creates internal `BuildPluginType` via `createPugTemplatesPlugin` (default)
 * - `html` → creates internal `BuildPluginType` via `createHtmlTemplatesPlugin`
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
 * - styles (scss/less) — `stylesRule` for pug/none, `htmlStylesRule` for html
 * - pug (only when templates type is 'pug')
 * - html (only when templates type is 'html')
 *
 * The `htmlRule` enables two modes for `.html` files:
 * - **compile** (issuer: JS/TS) → returns a function; use as `import template from './home.html'`
 * - **render** (entry files)    → renders static HTML; resolves static asset tags
 *
 * The `htmlStylesRule` replaces `stylesRule` for `type: 'html'`:
 * - development → `style-loader` (injects CSS via <style> tags, HMR-friendly)
 * - production  → `MiniCssExtractPlugin.loader` (extracts CSS into a separate file)
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
     *
     * For `type: 'html'`, `htmlStylesRule` replaces the standard `stylesRule` because
     * the CSS extraction strategy is different:
     * - `stylesRule` is designed for `pug-plugin` which handles extraction internally.
     * - `htmlStylesRule` uses `style-loader` (dev) or `MiniCssExtractPlugin` (prod)
     *   which is required when styles are imported from a standard JS/TS entry.
     */
    const isHtmlMode = templateType === 'html';

    let rules: RuleSetRule[] = [
        assetsRule(),
        scriptsRule(normalized),
        isHtmlMode ? htmlStylesRule(normalized) : stylesRule(normalized),
    ];

    /**
     * Conditionally enable pug processing.
     * Inserted at the front so it takes priority over other rules.
     */
    if (templateType === 'pug') {
        rules.unshift(pugRule());
    }

    /**
     * Conditionally enable html processing.
     *
     * Provides dual-mode handling for `.html` files:
     * - compile mode: `import template from './home.html'` in JS/TS → returns a callable function
     * - render mode: entry `.html` files processed by html-webpack-plugin → resolves static assets
     *
     * Inserted at the front so it takes priority over other rules.
     *
     * ⚠️ Requires `ejs-loader` and `html-loader` peer dependencies.
     */
    if (templateType === 'html') {
        rules.unshift(htmlRule());
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
     *
     * Template plugins (pug, html) are no longer pushed here directly.
     * They are registered as internal BuildPlugins below and push their
     * webpack instances into `config.plugins` through `applyBase` hooks.
     * This makes them visible to `dedupePlugins` and `plugins.override`.
     */
    let plugins: WebpackPluginInstance[] = [];

    /**
     * Apply user plugins overrides/extensions.
     * These are merged before the config object is created so user-provided
     * plugins are included in the initial `dedupePlugins` pass.
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
     *
     * Internal template plugins (`createPugTemplatesPlugin`, `createHtmlTemplatesPlugin`)
     * are prepended as the first entries so they run before user-supplied `buildPlugins`.
     * This guarantees that template-related webpack plugins and entry points are in
     * `config.plugins` / `config.entry` before any user hook has a chance to read or
     * further mutate them — and before the final `dedupePlugins` pass cleans up duplicates.
     */
    const internalBuildPlugins: BuildPluginType[] = [];

    /**
     * PUG templates support
     *
     * Registered as an internal BuildPlugin so `applyBase` pushes PugPlugin into
     * `config.plugins` declaratively — visible to `dedupePlugins` and `plugins.override`.
     */
    if (templateType === 'pug') {
        if (!normalized.templates.entry) {
            throw new Error('[build] templates.entry is required when templates.type is "pug"');
        }

        internalBuildPlugins.push(
            createPugTemplatesPlugin({
                entry: normalized.templates.entry,
                mode: normalized.mode,
                appType: normalized.appType,
                data: normalized.templates.data,
            })
        );
    }

    /**
     * HTML templates support (HtmlWebpackPlugin wrapper)
     *
     * Registered as an internal BuildPlugin so `applyBase` declaratively:
     * - injects `entry.main` (JS/TS script entry)
     * - pushes MiniCssExtractPlugin (production only)
     * - pushes HtmlWebpackPlugin instance(s)
     *
     * Works together with:
     * - `htmlRule`       → enables `import template from './component.html'` in JS/TS (compile mode)
     * - `htmlStylesRule` → extracts CSS via style-loader (dev) or MiniCssExtractPlugin (prod)
     * - `scriptEntry`    → registered as the Webpack entry so the bundle is built and injected
     */
    if (templateType === 'html') {
        if (!normalized.templates.entry) {
            throw new Error('[build] templates.entry is required when templates.type is "html"');
        }

        if (!normalized.templates.scriptEntry) {
            throw new Error('[build] templates.scriptEntry is required when templates.type is "html"');
        }

        internalBuildPlugins.push(
            createHtmlTemplatesPlugin({
                entry: normalized.templates.entry,
                scriptEntry: normalized.templates.scriptEntry,
                mode: normalized.mode,
                appType: normalized.appType,
                data: normalized.templates.data as Record<string, unknown> | undefined,
            })
        );
    }

    const buildPlugins = options.buildPlugins ?? [];

    // Internal plugins run first, then user-supplied plugins.
    const allBuildPlugins = [...internalBuildPlugins, ...buildPlugins];

    // Run setup phase (internal plugins have no setup hook by design)
    for (const plugin of allBuildPlugins) {
        plugin.setup?.({options: normalized});
    }

    // Apply base config hooks
    for (const plugin of allBuildPlugins) {
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
     * Store metadata (appType + buildPlugins).
     * Only user-supplied buildPlugins are stored — internal template plugins
     * have already completed their work in applyBase and do not need dev/prod hooks.
     */
    setConfigMeta(config, {
        appType: normalized.appType,
        buildPlugins,
    });

    return config;
}
