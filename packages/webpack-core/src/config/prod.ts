import type {Configuration} from 'webpack';
import {merge} from 'webpack-merge';

export function createProdConfig(
    baseConfig: Configuration,
    options: Configuration = {}
): Configuration {
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

    return merge(baseConfig, defaultConfig, options);
}
