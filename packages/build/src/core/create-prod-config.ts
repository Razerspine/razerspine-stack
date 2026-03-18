/**
 * @module create-prod-config
 * @description Finalizes the configuration for production builds with optimizations.
 */

import {Configuration} from 'webpack';
import {merge} from 'webpack-merge';
import {HostingRoutingPlugin} from '../plugins/hosting-routing-plugin';
import {getConfigMeta} from './config-meta';

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
        plugins: [
            // Handles hosting-specific routing rules based on app architecture
            new HostingRoutingPlugin({appType}),
        ],
    };

    return merge(baseConfig, defaultConfig, options);
}
