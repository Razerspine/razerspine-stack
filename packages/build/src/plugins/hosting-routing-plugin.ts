import {
    Compiler,
    Compilation,
    sources,
} from 'webpack';
import {AppType, HostingType} from '../types';
import {detectHosting} from '../hosting/detect-hosting';
import {getRedirects} from '../hosting/get-redirects';
import {textCapitalize} from '../utils';

type HostingRoutingPluginOptions = {
    appType: AppType;
};

/**
 * @class HostingRoutingPlugin
 * @description Webpack plugin that generates hosting-specific routing assets during production build.
 *
 * Responsibilities:
 * - Netlify / Cloudflare → emits `_redirects` into dist
 * - Vercel               → logs a reminder only; `vercel.json` must live in the project root (not dist),
 *                          because Vercel reads it from the repository root before the build runs.
 *                          Emitting it into dist has no effect and may cause confusion.
 * - SPA (any host)       → emits `404.html` as a copy of `index.html` for static host fallback routing
 *
 * Lifecycle:
 * Uses `PROCESS_ASSETS_STAGE_SUMMARIZE` (late stage) to ensure that `index.html`
 * already exists in the compilation when the SPA fallback is generated.
 */
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
            'HostingRoutingPlugin',
            (compilation: Compilation) => {
                compilation.hooks.processAssets.tap(
                    {
                        name: 'HostingRoutingPlugin',
                        /**
                         * PROCESS_ASSETS_STAGE_SUMMARIZE is used intentionally:
                         * it runs after all assets (including index.html from PugPlugin/HtmlPlugin)
                         * have been emitted, so the SPA 404.html fallback can safely read index.html.
                         */
                        stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
                    },
                    () => {
                        const {appType, hosting} = this;

                        /**
                         * Netlify / Cloudflare
                         * Emit `_redirects` into dist for SPA rewrite or MPA 404 fallback.
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
                         *
                         * Vercel reads vercel.json from the repository root — before the build starts.
                         * Instead, we log a reminder so the developer is aware.
                         */
                        if (hosting === 'vercel') {
                            logger.info(
                                `📦 Vercel detected (${appType.toUpperCase()} mode). ` +
                                `Ensure vercel.json is present in your project root with correct rewrite rules. ` +
                                `See: https://vercel.com/docs/project-configuration`
                            );
                        }

                        /**
                         * SPA fallback
                         *
                         * For any hosting (including static, GitHub Pages, etc.):
                         * duplicate index.html as 404.html so that deep links work
                         * without server-side routing support.
                         *
                         * Runs at SUMMARIZE stage to guarantee index.html is available.
                         */
                        if (appType === 'spa') {
                            const indexAsset = compilation.getAsset('index.html');

                            if (indexAsset) {
                                const source = indexAsset.source.source().toString();

                                logger.info(`📦 SPA detected. Creating 404.html fallback...`);

                                compilation.emitAsset(
                                    '404.html',
                                    new sources.RawSource(source)
                                );
                            } else {
                                logger.warn(
                                    `📦 SPA mode: index.html not found in compilation assets. ` +
                                    `404.html fallback was not generated. ` +
                                    `Make sure your template plugin emits index.html.`
                                );
                            }
                        }
                    }
                );
            }
        );
    }
}
