import type {Configuration as WebpackConfiguration} from 'webpack';
import type {Configuration as DevServerConfiguration} from 'webpack-dev-server';
import {merge} from 'webpack-merge';

type DevConfig = WebpackConfiguration & {
    devServer?: DevServerConfiguration;
};

export function createDevConfig(
    baseConfig: WebpackConfiguration,
    options: DevServerConfiguration = {}
): DevConfig {
    const defaultDevServer: DevServerConfiguration = {
        hot: false,
        liveReload: true,
        compress: true,
        port: 8080,
        watchFiles: ['src/**/*'],
        historyApiFallback: {
            disableDotRule: true,
            rewrites: [{from: /./, to: '/404.html'}]
        }
    };

    return merge(baseConfig, {
        devtool: 'source-map',
        devServer: merge(defaultDevServer, options)
    }) as DevConfig;
}
