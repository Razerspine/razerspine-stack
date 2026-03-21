/**
 * @module create-dev-config
 * @description Extends the base configuration with Webpack Dev Server settings.
 */

import {Configuration as WebpackConfiguration, WebpackPluginInstance} from 'webpack';
import type {Configuration as DevServerConfiguration} from 'webpack-dev-server';
import {merge} from 'webpack-merge';
import {BaseWebpackConfigType} from '../types';
import {getConfigMeta} from './config-meta';
import {dedupePlugins} from '../utils/dedupe-plugins';

type DevConfig = BaseWebpackConfigType & {
    devServer?: DevServerConfiguration;
};

/**
 * Creates a development configuration by merging base settings with DevServer options.
 * Automatically configures routing fallbacks based on whether the app is SPA or MPA.
 * @param {BaseWebpackConfigType} baseConfig - The base configuration from createBaseConfig.
 * @param {DevServerConfiguration} [options={}] - Optional DevServer overrides.
 * @returns {DevConfig} The final development configuration.
 */
export function createDevConfig(
    baseConfig: BaseWebpackConfigType,
    options: DevServerConfiguration = {}
): DevConfig {
    const meta = getConfigMeta(baseConfig);
    const appType = meta?.appType ?? 'mpa';

    /** Default dev server settings */
    const baseDevServer: DevServerConfiguration = {
        hot: false,
        open: true,
        liveReload: true,
        compress: true,
        port: 8080,
        watchFiles: ['src/**/*'],
    };

    /** Fallback logic: SPA redirects to index, MPA redirects to 404 */
    const defaultFallbackConfig: DevServerConfiguration = {
        historyApiFallback: {
            disableDotRule: true,
            rewrites: [
                {
                    from: /./,
                    to: appType === 'spa' ? '/index.html' : '/404.html',
                }
            ]
        }
    };

    // Use default fallbacks unless the user provided their own historyApiFallback config
    const fallbackToMerge = options.historyApiFallback !== undefined
        ? {}
        : defaultFallbackConfig;

    const resultDevServer = merge(
        baseDevServer,
        fallbackToMerge,
        options
    );

    const finalConfig = merge(baseConfig as WebpackConfiguration, {
        devtool: 'source-map',
        devServer: resultDevServer,
    }) as DevConfig;

    /**
     * Build Plugins (dev lifecycle)
     */
    const metaWithPlugins = getConfigMeta(baseConfig);

    if (metaWithPlugins?.buildPlugins) {
        for (const plugin of metaWithPlugins.buildPlugins) {
            plugin.applyDev?.(finalConfig);
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
