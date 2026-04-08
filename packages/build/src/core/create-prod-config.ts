/**
 * @module create-prod-config
 * @description Finalizes the configuration for production builds with optimizations.
 */

import {Configuration, WebpackPluginInstance} from 'webpack';
import {merge} from 'webpack-merge';
import {HostingRoutingPlugin} from '../plugins/hosting-routing-plugin';
import {getConfigMeta} from './config-meta';
import {dedupePlugins, markPlugin} from '../utils';

/**
 * Creates a production configuration with minification and hosting-specific plugins.
 *
 * The `HostingRoutingPlugin` instance is tagged via {@link markPlugin} so that
 * `dedupePlugins` can identify it as an internal framework plugin. Any untagged
 * instance of the same class added by the user via `plugins.extend` will be removed
 * by the hybrid deduplication pass, preventing double-registration.
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

    /**
     * Internal production plugins.
     *
     * `HostingRoutingPlugin` is tagged with {@link markPlugin} so that
     * `dedupePlugins` treats it as an authoritative internal instance and removes
     * any untagged copy of the same class that the user may have added via
     * `plugins.extend` in the base config.
     */
    const defaultPlugins = [
        markPlugin(new HostingRoutingPlugin({appType})),
    ];

    const defaultConfig: Configuration = {
        devtool: 'source-map',
        optimization: {
            minimize: true,
            splitChunks: false,
            runtimeChunk: false,
        },
        performance: {
            hints: false,
        },
    };

    const finalConfig = merge(baseConfig, {
        ...defaultConfig,
        plugins: defaultPlugins,
    }, options);

    /**
     * Build Plugins (prod lifecycle)
     */
    const metaWithPlugins = getConfigMeta(baseConfig);

    if (metaWithPlugins?.buildPlugins) {
        for (const plugin of metaWithPlugins.buildPlugins) {
            plugin.applyProd?.(finalConfig);
        }
    }

    /**
     * Re-dedupe plugins after merge and buildPlugins mutations.
     *
     * The hybrid strategy in `dedupePlugins` removes untagged instances of classes
     * that are already covered by a tagged instance (e.g. `HostingRoutingPlugin`
     * added via `plugins.extend` alongside the internal tagged instance).
     */
    if (finalConfig.plugins) {
        finalConfig.plugins = dedupePlugins(finalConfig.plugins as WebpackPluginInstance[]);
    }

    return finalConfig;
}
