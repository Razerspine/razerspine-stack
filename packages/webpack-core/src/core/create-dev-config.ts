import {Configuration as WebpackConfiguration} from 'webpack';
import type {Configuration as DevServerConfiguration} from 'webpack-dev-server';
import {merge} from 'webpack-merge';
import {BaseWebpackConfigType} from '../types/base-webpack-config-type';
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
