import {
    Configuration,
    LoaderOptionsPlugin,
    Compilation,
    Compiler,
    sources,
} from 'webpack';
import {merge} from 'webpack-merge';
import {AppType} from '../types/app-type';
import {detectHosting} from '../utils/detect-hosting';
import {getVercelConfig} from '../utils/get-vercel-config';
import {getRedirects} from '../utils/get-redirects';

export function createProdConfig(
    baseConfig: Configuration,
    options: Configuration = {}
): Configuration {
    const loaderPlugin = baseConfig.plugins?.find(
        (p): p is LoaderOptionsPlugin => p instanceof LoaderOptionsPlugin
    );

    const appType: AppType =
        (loaderPlugin as any)?.options?.options?._meta?.appType ?? 'mpa';

    const hosting = detectHosting();

    const routingPlugin = {
        apply(compiler: Compiler) {
            compiler.hooks.thisCompilation.tap(
                'RoutingPlugin',
                (compilation: Compilation) => {
                    compilation.hooks.processAssets.tap(
                        {
                            name: 'RoutingPlugin',
                            stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
                        },
                        () => {
                            /**
                             * Netlify / Cloudflare
                             */
                            if (hosting === 'netlify' || hosting === 'cloudflare') {
                                compilation.emitAsset(
                                    '_redirects',
                                    new sources.RawSource(getRedirects(appType))
                                );
                            }

                            /**
                             * Vercel
                             */
                            if (hosting === 'vercel') {
                                compilation.emitAsset(
                                    'vercel.json',
                                    new sources.RawSource(getVercelConfig(appType))
                                );

                            }

                            /**
                             * SPA fallback
                             * Needed for:
                             * - GitHub Pages
                             * - static hosting
                             */
                            if (appType === 'spa') {
                                const indexAsset = compilation.getAsset('index.html');

                                if (indexAsset) {
                                    const source = indexAsset.source.source().toString();

                                    if (hosting === 'github' || hosting === 'static') {

                                        compilation.emitAsset(
                                            '404.html',
                                            new sources.RawSource(source)
                                        );
                                    }
                                }
                            }
                        }
                    );
                }
            );
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
