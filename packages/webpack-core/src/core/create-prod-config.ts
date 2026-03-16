import {
    Configuration,
    LoaderOptionsPlugin,
} from 'webpack';
import {merge} from 'webpack-merge';
import {AppType} from '../types/app-type';
import {HostingRoutingPlugin} from '../plugins/hosting-routing-plugin';

export function createProdConfig(
    baseConfig: Configuration,
    options: Configuration = {}
): Configuration {
    const loaderPlugin = baseConfig.plugins?.find(
        (p): p is LoaderOptionsPlugin => p instanceof LoaderOptionsPlugin
    );
    const appType: AppType = (loaderPlugin as any)?.options?.options?._meta?.appType ?? 'mpa';

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
