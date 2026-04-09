/**
 * @module create-prod-config
 * @description Finalizes the configuration for production builds with optimizations.
 */

import {Configuration, WebpackPluginInstance} from 'webpack';
import {merge} from 'webpack-merge';
import {createHostingRoutingPlugin} from '../plugins/hosting-routing-plugin';
import {getConfigMeta, setConfigMeta} from './config-meta';
import {dedupePlugins} from '../utils';

/**
 * Creates a production configuration with minification and hosting-specific plugins.
 *
 * `HostingRoutingPlugin` is registered via `createHostingRoutingPlugin`, which is a
 * {@link BuildPluginType} factory consistent with `createPugTemplatesPlugin` and
 * `createHtmlTemplatesPlugin`. The factory's `applyProd` hook tags the instance via
 * {@link markPlugin} so `dedupePlugins` can remove any untagged duplicate added by
 * the user via `plugins.extend`, preventing double-registration.
 *
 * @param {Configuration} baseConfig - The base configuration from createBaseConfig.
 * @param {Configuration} [options={}] - Additional Webpack overrides for production.
 * @returns {Configuration} The optimized production configuration.
 */
export function createProdConfig(
    baseConfig: Configuration,
    options: Configuration = {}
): Configuration {
    const meta = getConfigMeta(baseConfig);
    const appType = meta?.appType ?? 'mpa';

    const defaultConfig: Configuration = {
        devtool: 'source-map',
        optimization: {
            minimize: true,
            splitChunks: {
                cacheGroups: {
                    vendors: {
                        test: /\.(js|ts)$/,
                        chunks: 'all',
                        name: 'vendors',
                        enforce: true,
                    },
                },
            },
            runtimeChunk: false,
        },
        performance: {
            hints: false,
        },
    };

    const finalConfig = merge(baseConfig, defaultConfig, options);

    /**
     * Re-bind metadata to the merged config object.
     * webpack-merge produces a new object, so the WeakMap entry from baseConfig
     * is not carried over — downstream plugins calling getConfigMeta(finalConfig)
     * would receive undefined without this step.
     */
    if (meta) {
        setConfigMeta(finalConfig, meta);
    }

    /**
     * Internal production build plugin.
     *
     * `createHostingRoutingPlugin` follows the same `BuildPluginType` factory pattern
     * as `createPugTemplatesPlugin` / `createHtmlTemplatesPlugin`. Its `applyProd` hook
     * pushes a `markPlugin`-tagged `HostingRoutingPlugin` instance into `config.plugins`,
     * making deduplication co-located with the plugin definition rather than spread across
     * call sites.
     */
    createHostingRoutingPlugin({appType}).applyProd?.(finalConfig);

    /**
     * Build Plugins (prod lifecycle)
     */
    if (meta?.buildPlugins) {
        for (const plugin of meta.buildPlugins) {
            plugin.applyProd?.(finalConfig);
        }
    }

    /**
     * Re-dedupe plugins after merge and buildPlugins mutations.
     *
     * The hybrid strategy in `dedupePlugins` removes untagged instances of classes
     * that are already covered by a tagged instance (e.g. `HostingRoutingPlugin`
     * added via `plugins.extend` alongside the internal tagged instance).
     * Type guard passes both object instances and function-style plugins.
     */
    if (finalConfig.plugins) {
        finalConfig.plugins = dedupePlugins(
            finalConfig.plugins.filter(
                (p): p is WebpackPluginInstance =>
                    (typeof p === 'object' && p !== null) || typeof p === 'function'
            )
        );
    }

    return finalConfig;
}
