import type {Configuration as WebpackConfiguration} from 'webpack';
import type {Configuration as DevServerConfiguration} from 'webpack-dev-server';

type DevConfig = WebpackConfiguration & {
    devServer?: DevServerConfiguration;
};

export function createDevConfig(baseConfig: WebpackConfiguration): DevConfig {
    return {
        ...baseConfig,
        devtool: 'source-map',
        devServer: {
            hot: false,
            liveReload: true,
            compress: true,
            port: 8080,
            watchFiles: [
                'src/**/*',
            ],
            historyApiFallback: {
                disableDotRule: true,
                rewrites: [
                    {from: /./, to: '/404.html'}
                ]
            }
        }
    };
}
