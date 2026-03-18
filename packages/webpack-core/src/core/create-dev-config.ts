import {Configuration as WebpackConfiguration} from 'webpack';
import type {Configuration as DevServerConfiguration} from 'webpack-dev-server';
import {merge} from 'webpack-merge';
import {BaseWebpackConfigType} from '../types';
import {getConfigMeta} from './config-meta';

type DevConfig = BaseWebpackConfigType & {
    devServer?: DevServerConfiguration;
};

export function createDevConfig(
    baseConfig: BaseWebpackConfigType,
    options: DevServerConfiguration = {}
): DevConfig {
    const meta = getConfigMeta(baseConfig);
    const appType = meta?.appType ?? 'mpa';
    const baseDevServer: DevServerConfiguration = {
        hot: false,
        open: true,
        liveReload: true,
        compress: true,
        port: 8080,
        watchFiles: ['src/**/*'],
    };

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

    const fallbackToMerge = options.historyApiFallback !== undefined
        ? {}
        : defaultFallbackConfig;

    const resultDevServer = merge(
        baseDevServer,
        fallbackToMerge,
        options
    );

    return merge(baseConfig as WebpackConfiguration, {
        devtool: 'source-map',
        devServer: resultDevServer,
    }) as DevConfig;
}
