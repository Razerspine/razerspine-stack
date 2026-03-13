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
            const logger = compiler.getInfrastructureLogger('@razerspine/webpack-core');

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
                                logger.info(`📦 ${hosting.charAt(0).toUpperCase() + hosting.slice(1)} detected. Generating _redirects for ${appType.toUpperCase()}...`);

                                compilation.emitAsset(
                                    '_redirects',
                                    new sources.RawSource(getRedirects(appType))
                                );
                            }

                            /**
                             * Vercel
                             */
                            if (hosting === 'vercel') {
                                logger.info(`📦 Vercel detected. Generating vercel.json for ${appType.toUpperCase()}...`);

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
                                        const hostName = hosting === 'github' ? 'GitHub Pages' : 'Static hosting';
                                        logger.info(`📦 ${hostName} detected. Creating 404.html fallback for SPA...`);
                                        
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
