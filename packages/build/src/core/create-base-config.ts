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
import {createStaticCopyPlugin} from '../plugins/static-copy-plugin';
import {BuildPluginType} from '../types';
import {dedupePlugins, dedupeRules} from '../utils';

/**
 * Creates a base Webpack configuration object.
 * Also initializes internal metadata (appType) for use in dev/prod overrides.
 *
 * Supports controlled extension/override of internal rules and plugins.
 *
 * ---
 * ## Entry point strategy
 *
 * `config.entry.main` is set from `normalized.templates.scriptEntry` **only for
 * `templates.type: 'html'` and `templates.type: 'none'`**.
 *
 * It is intentionally **not set for `templates.type: 'pug'`** because `pug-plugin`
 * (html-bundler-webpack-plugin) manages its own internal entry system — it reads
 * `.pug` files as entry points and builds the JS/CSS bundles internally.
 * Injecting an external `entry.main` alongside `pug-plugin` entries causes a
 * "Module not found" error at build time when `src/app/main.js` does not exist
 * in the project (which is the expected setup for Pug-driven projects).
 *
 * Per-type behavior:
 * - `none`  → `entry.main` set here; no template plugin registered.
 *             Required for React/Vue setups that own their own HTML output.
 * - `html`  → `entry.main` set here; `HtmlWebpackPlugin` injects the compiled
 *             bundle into the HTML template automatically.
 * - `pug`   → `entry` is NOT set; `pug-plugin` registers its own entries via
 *             `applyBase`. The `scriptEntry` in `normalizeOptions` is resolved
 *             but only used to validate that a sensible default exists — it is
 *             not registered as a Webpack entry in this mode.
 *
 * `createHtmlTemplatesPlugin.applyBase` contains a safety guard that will not
 * overwrite `entry.main` if it was already set.
 *
 * ---
 * ## Template system
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
 * ## Rules system
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
 * ## Plugins system
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
 * ## Plugin deduplication
 *
 * All internal plugin instances are tagged via `markPlugin` before being pushed into
 * `config.plugins`. `dedupePlugins` uses a hybrid strategy:
 * - Tagged instances are deduplicated by their unique Symbol (first-wins).
 * - Untagged (user-supplied) instances are removed only when a tagged instance of
 *   the same class already exists, preventing double-registration via `plugins.extend`.
 * - Purely user-supplied plugin classes (no internal counterpart) are never touched.
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
     * Template plugins (pug, html) are not pushed here directly.
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

    /**
     * Webpack entry registration for `html` and `none` template types.
     *
     * `entry.main` is set from `normalized.templates.scriptEntry` only when the
     * template engine does NOT manage entries itself:
     *
     * - `none` → no template plugin; Webpack needs an explicit entry to build the bundle.
     * - `html` → `html-webpack-plugin` generates HTML but requires a JS/TS entry for
     *            the script bundle that gets injected into the output.
     *
     * For `pug`, `pug-plugin` (html-bundler-webpack-plugin) registers its own internal
     * entry points from the `.pug` files. Injecting an external `entry.main` would cause
     * a "Module not found" error when `src/app/main.js` does not exist — which is the
     * expected state for Pug-driven projects that embed scripts inside `.pug` templates.
     *
     * `createHtmlTemplatesPlugin.applyBase` has a safety guard and will not overwrite
     * `entry.main` if it is already present.
     */
    const entry: Configuration['entry'] | undefined =
        templateType === 'html' || templateType === 'none'
            ? {
                main: {
                    import: [normalized.templates.scriptEntry as string],
                },
            }
            : undefined;

    const config: Configuration = {
        mode: normalized.mode,
        context: process.cwd(),
        ...(entry !== undefined && {entry}),
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
    const internalBuildPlugins: BuildPluginType[] = [
        createStaticCopyPlugin(),
    ];

    /**
     * PUG templates support
     *
     * Registered as an internal BuildPlugin so `applyBase` pushes PugPlugin into
     * `config.plugins` declaratively — visible to `dedupePlugins` and `plugins.override`.
     *
     * `pug-plugin` manages its own entry system — `entry.main` is intentionally NOT set
     * for this template type (see entry registration block above).
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
     * - guards against overwriting `entry.main` (already set above for `html` type)
     * - pushes MiniCssExtractPlugin (production only)
     * - pushes HtmlWebpackPlugin instance(s)
     *
     * Works together with:
     * - `htmlRule`       → enables `import template from './component.html'` in JS/TS (compile mode)
     * - `htmlStylesRule` → extracts CSS via style-loader (dev) or MiniCssExtractPlugin (prod)
     * - `entry.main`     → registered above as the Webpack entry so the bundle is built and injected
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

    /**
     * Apply base config hooks.
     *
     * When `plugins.override` is set, internal build plugins are excluded from
     * the `applyBase` pass. This prevents template plugins (Pug, Html) from
     * pushing their webpack plugin instances into `config.plugins` and silently
     * bypassing the user's explicit override.
     *
     * User-supplied `buildPlugins` always run regardless of `plugins.override`.
     */
    const pluginsToApplyBase = options.plugins?.override ? buildPlugins : allBuildPlugins;

    for (const plugin of pluginsToApplyBase) {
        plugin.applyBase?.(config);
    }

    /**
     * Re-dedupe rules after buildPlugins mutations.
     * Filters out "..." spread markers (valid in Webpack 5 rule arrays) before
     * deduplication, since dedupeRules only handles RuleSetRule objects.
     */
    if (config.module?.rules) {
        config.module.rules = dedupeRules(
            config.module.rules.filter((r): r is RuleSetRule => typeof r !== 'string')
        );
    }

    /**
     * Re-dedupe plugins after buildPlugins mutations.
     * Filters out function-style plugins before deduplication, since dedupePlugins
     * operates on WebpackPluginInstance objects only.
     */
    if (config.plugins) {
        config.plugins = dedupePlugins(
            config.plugins.filter((p): p is WebpackPluginInstance => typeof p === 'object' && p !== null)
        );
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
