import {Configuration} from 'webpack';
import {merge} from 'webpack-merge';
import {HostingRoutingPlugin} from '../plugins/hosting-routing-plugin';
import {getConfigMeta} from './config-meta';

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
            new HostingRoutingPlugin({appType}),
        ],
    };

    return merge(baseConfig, defaultConfig, options);
}
