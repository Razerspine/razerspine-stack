/**
 * @module create-prod-config
 * @description Finalizes the configuration for production builds with optimizations.
 */

import {Configuration, WebpackPluginInstance} from 'webpack';
import {merge} from 'webpack-merge';
import {HostingRoutingPlugin} from '../plugins/hosting-routing-plugin';
import {getConfigMeta} from './config-meta';
import {dedupePlugins} from '../utils';

/**
 * Creates a production configuration with minification and hosting-specific plugins.
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
    const defaultPlugins = [
        new HostingRoutingPlugin({appType}),
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
     * Re-dedupe plugins after merge and buildPlugins mutations
     */
    if (finalConfig.plugins) {
        finalConfig.plugins = dedupePlugins(finalConfig.plugins as WebpackPluginInstance[]);
    }

    return finalConfig;
}
