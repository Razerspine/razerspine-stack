import {Configuration, LoaderOptionsPlugin, Compilation, sources} from 'webpack';
import {merge} from 'webpack-merge';
import {AppType} from '../types/app-type';

function getRedirects(appType: AppType): string {
    return appType === 'spa'
        ? '/* /index.html   200\n'
        : '/* /404.html     404\n';
}

function getVercelConfig(appType: AppType): string {
    const config = appType === 'spa'
        ? {routes: [{src: '/(.*)', dest: '/index.html'}]}
        : {
            routes: [
                {handle: 'filesystem'},
                {src: '/(.*)', dest: '/404.html', status: 404}
            ]
        };

    return JSON.stringify(config, null, 2);
}

export function createProdConfig(
    baseConfig: Configuration,
    options: Configuration = {}
): Configuration {
    const loaderPlugin = baseConfig.plugins?.find(
        (p): p is LoaderOptionsPlugin => p instanceof LoaderOptionsPlugin
    );
    const appType: AppType = (loaderPlugin as any)?.options?.options?._meta?.appType ?? 'mpa';

    const routingPlugin = {
        apply(compiler: any) {
            compiler.hooks.thisCompilation.tap('RoutingPlugin', (compilation: Compilation) => {
                compilation.hooks.processAssets.tap(
                    {
                        name: 'RoutingPlugin',
                        stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
                    },
                    () => {
                        const {RawSource} = sources;

                        compilation.emitAsset(
                            '_redirects',
                            new RawSource(getRedirects(appType))
                        );

                        compilation.emitAsset(
                            'vercel.json',
                            new RawSource(getVercelConfig(appType))
                        );

                        if (appType === 'spa') {
                            const indexAsset = compilation.getAsset('index.html');
                            if (indexAsset) {
                                compilation.emitAsset('404.html', indexAsset.source);
                            }
                        }
                    }
                );
            });
        },
    };

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
        plugins: [routingPlugin],
    };
    return merge(baseConfig, defaultConfig, options);
}
