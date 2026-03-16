import {Configuration as WebpackConfiguration, LoaderOptionsPlugin} from 'webpack';
import type {Configuration as DevServerConfiguration} from 'webpack-dev-server';
import {merge} from 'webpack-merge';
import {AppType} from '../types/app-type';
import {BaseWebpackConfigType} from '../types/base-webpack-config-type';

type DevConfig = BaseWebpackConfigType & {
    devServer?: DevServerConfiguration;
};

export function createDevConfig(
    baseConfig: BaseWebpackConfigType,
    options: DevServerConfiguration = {}
): DevConfig {
    const loaderPlugin = baseConfig.plugins?.find(
        (p): p is LoaderOptionsPlugin => p instanceof LoaderOptionsPlugin
    );
    const appType: AppType = (loaderPlugin as any)?.options?.options?._meta?.appType ?? 'mpa';
    const historyApiFallBack: DevServerConfiguration['historyApiFallback'] = {
        disableDotRule: true,
        rewrites: [
            {
                from: /./,
                to: appType === 'spa' ? '/index.html' : '/404.html',
            }
        ]
    }
    const defaultDevServer: DevServerConfiguration = {
        hot: false,
        open: true,
        liveReload: true,
        compress: true,
        port: 8080,
        watchFiles: ['src/**/*'],
        historyApiFallback: historyApiFallBack,
    };

    return merge(baseConfig as WebpackConfiguration, {
        devtool: 'source-map',
        devServer: merge(defaultDevServer, options)
    }) as DevConfig;
}
