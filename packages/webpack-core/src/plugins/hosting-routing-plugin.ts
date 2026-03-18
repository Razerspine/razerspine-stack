import {
    Compiler,
    Compilation,
    sources,
} from 'webpack';
import {AppType, HostingType} from '../types';
import {detectHosting} from '../hosting/detect-hosting';
import {getRedirects} from '../hosting/get-redirects';
import {getVercelConfig} from '../hosting/get-vercel-config';
import {textCapitalize} from '../utils/text-capitalize';

type HostingRoutingPluginOptions = {
    appType: AppType;
};

export class HostingRoutingPlugin {
    private appType: AppType;
    private hosting: HostingType;

    constructor(options: HostingRoutingPluginOptions) {
        this.appType = options.appType;
        this.hosting = detectHosting();
    }

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
                        const {appType, hosting} = this;

                        /**
                         * Netlify / Cloudflare
                         */
                        if (hosting === 'netlify' || hosting === 'cloudflare') {
                            logger.info(
                                `📦 ${textCapitalize(hosting)} detected. Generating _redirects for ${appType.toUpperCase()}...`
                            );

                            compilation.emitAsset(
                                '_redirects',
                                new sources.RawSource(getRedirects(appType))
                            );
                        }

                        /**
                         * Vercel
                         */
                        if (hosting === 'vercel') {
                            logger.info(
                                `📦 Vercel detected. Generating vercel.json for ${appType.toUpperCase()}...`
                            );

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

                            if (!indexAsset) return;

                            const source = indexAsset.source.source().toString();

                            if (hosting === 'github' || hosting === 'static') {
                                const hostName =
                                    hosting === 'github'
                                        ? 'GitHub Pages'
                                        : 'Static hosting';

                                logger.info(
                                    `📦 ${hostName} detected. Creating 404.html fallback for SPA...`
                                );

                                compilation.emitAsset(
                                    '404.html',
                                    new sources.RawSource(source)
                                );
                            }
                        }
                    }
                );
            }
        );
    }
}

