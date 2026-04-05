/**
 * @module html-styles-rule
 * @description Webpack rule for processing CSS/SCSS/Less files when `templates.type` is `'html'`.
 *
 * This rule is distinct from the standard `stylesRule` (used for `type: 'pug'`) because
 * the extraction strategy differs:
 *
 * - **`type: 'pug'`** uses `pug-plugin` (html-bundler-webpack-plugin), which handles CSS
 *   extraction internally via its own `css` output option. No `style-loader` or
 *   `MiniCssExtractPlugin` is needed in that pipeline.
 *
 * - **`type: 'html'`** relies on a standard Webpack JS entry + `html-webpack-plugin`.
 *   Styles are imported from JS/TS files (`import './style.scss'`) and must be extracted
 *   via `style-loader` (development) or `MiniCssExtractPlugin` (production) to reach the DOM.
 *
 * ---
 *
 * **Development** (`mode: 'development'`):
 * Uses `style-loader` to inject CSS directly into the DOM via `<style>` tags at runtime.
 * Fast, HMR-friendly, no separate `.css` file is emitted.
 *
 * **Production** (`mode: 'production'`):
 * Uses `MiniCssExtractPlugin.loader` to extract CSS into a separate `.css` file.
 * The file is then automatically injected into the output HTML by `html-webpack-plugin`.
 *
 * ---
 *
 * ⚠️ Requires the following peer dependencies depending on the mode:
 * ```bash
 * npm install -D mini-css-extract-plugin   # always required for type: 'html' in production
 * npm install -D style-loader              # always required for type: 'html' in development
 * ```
 *
 * Both loaders are used conditionally based on `mode`, so both should be installed.
 *
 * @see https://webpack.js.org/plugins/mini-css-extract-plugin/
 * @see https://webpack.js.org/loaders/style-loader/
 */
import {NormalizedCoreOptions} from '../options';

/**
 * Creates a Webpack rule for processing stylesheets in `type: 'html'` mode.
 *
 * Supports SCSS/Sass (`styles: 'scss'`) and Less (`styles: 'less'`).
 * Resolves the correct CSS extractor based on `mode`.
 *
 * @param {NormalizedCoreOptions} env - Normalized build options (used for `mode` and `styles`).
 * @returns {object} A Webpack RuleSetRule object.
 */
export function htmlStylesRule(env: NormalizedCoreOptions) {
    const isLess = env.styles === 'less';
    const isProd = env.mode === 'production';

    /**
     * Lazily resolve `MiniCssExtractPlugin` to avoid a hard dependency.
     * Only loaded in production mode — not needed in development (uses style-loader instead).
     *
     * @throws {Error} If `mini-css-extract-plugin` is not installed in production mode.
     */
    function resolveMiniCssExtractLoader(): string {
        try {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const mod = require('mini-css-extract-plugin');
            const Plugin = mod?.default ?? mod;
            return Plugin.loader;
        } catch {
            throw new Error(
                '[build] Missing peer dependency: `mini-css-extract-plugin`.\n' +
                'Install it with:\n\n' +
                '  npm install -D mini-css-extract-plugin\n\n' +
                'Required when using `templates.type: "html"` in production mode.'
            );
        }
    }

    /**
     * CSS extraction loader:
     * - development → `style-loader` (injects CSS via <style> tags, supports HMR)
     * - production  → `MiniCssExtractPlugin.loader` (emits a separate .css file)
     */
    const extractLoader = isProd
        ? resolveMiniCssExtractLoader()
        : 'style-loader';

    return {
        test: isLess ? /\.(css|less)$/ : /\.(css|scss|sass)$/,
        use: [
            extractLoader,
            'css-loader',
            {
                loader: 'postcss-loader',
                options: {
                    postcssOptions: {
                        plugins: ['autoprefixer'],
                    },
                },
            },
            isLess
                ? {
                    loader: 'less-loader',
                    options: {
                        lessOptions: {javascriptEnabled: true},
                    },
                }
                : 'sass-loader',
        ],
    };
}
