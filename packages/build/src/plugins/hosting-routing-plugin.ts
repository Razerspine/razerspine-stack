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
        const logger = compiler.getInfrastructureLogger('@razerspine/build');
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
                         * Generates 404.html as a fallback for static hostings
                         */
                        if (appType === 'spa') {
                            const indexAsset = compilation.getAsset('index.html');

                            if (indexAsset) {
                                const source = indexAsset.source.source().toString();

                                // Always emit 404.html for SPA to ensure
                                // it's available for any static hosting
                                logger.info(`📦 SPA detected. Creating 404.html fallback...`);

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

