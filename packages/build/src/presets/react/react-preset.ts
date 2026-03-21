/**
 * @module react-preset
 * @description Production-ready React preset for @razerspine/build.
 *
 * Provides a modern React development experience using:
 * - Babel (no ts-loader)
 * - Automatic JSX runtime (react/jsx-runtime)
 * - TypeScript support (.ts / .tsx)
 * - React Fast Refresh (development only)
 *
 * ---
 * Behavior:
 *
 * - Automatically sets `templates.type = 'none'` if not defined
 * - Warns if incompatible template engines are used (pug/html)
 * - Injects Babel-based React pipeline
 * - Adds React Refresh plugin in development mode (if installed)
 *
 * ---
 * Requirements (must be installed in user project):
 *
 * ```bash
 * npm install -D \
 *   babel-loader \
 *   @babel/core \
 *   @babel/preset-env \
 *   @babel/preset-react \
 *   @babel/preset-typescript \
 *   @pmmmwh/react-refresh-webpack-plugin \
 *   react-refresh
 * ```
 *
 * ---
 * Example:
 *
 * ```ts
 * import {defineConfig, reactPreset} from '@razerspine/build';
 *
 * export default defineConfig({
 *   mode: 'development',
 *   scripts: 'ts',
 *   styles: 'scss',
 *   presets: [reactPreset()]
 * });
 * ```
 */

import {BuildPluginType} from '../../types';
import {Configuration, RuleSetRule} from 'webpack';

/**
 * Options for React preset
 */
type ReactPresetOptions = {
    /**
     * Enables TypeScript support (.ts / .tsx)
     *
     * @default true
     */
    typescript?: boolean;
};

/**
 * React preset factory
 *
 * @param options - React preset configuration
 * @returns Build plugin instance
 */
export function reactPreset(options: ReactPresetOptions = {}): BuildPluginType {
    const useTS = options.typescript ?? true;

    return {
        name: 'react-preset',
        /**
         * Setup phase
         *
         * - Ensures templates are disabled by default (React does not use Pug/HTML templates)
         * - Emits warning if user explicitly enables incompatible template engines
         */
        setup({options}) {
            const type = options.templates?.type;

            // Default to "none" if not explicitly defined
            if (!type) {
                options.templates = {type: 'none'};
            }

            // Warn about potential conflicts
            if (type === 'pug' || type === 'html') {
                console.warn(
                    `[react-preset] templates.type='${type}' may conflict with React setup.`
                );
            }
        },
        /**
         * Base configuration extension
         *
         * Injects:
         * - entry (if not provided)
         * - resolve.extensions
         * - Babel loader rule for React
         * - React Refresh plugin (development only)
         */
        applyBase(config: Configuration) {
            const isDev = config.mode === 'development';
            /**
             * Entry
             */
            if (!config.entry) {
                config.entry = useTS ? './src/main.tsx' : './src/main.jsx';
            }
            /**
             * Resolve extensions
             */
            config.resolve = {
                ...config.resolve,
                extensions: Array.from(new Set([
                    ...(config.resolve?.extensions || []),
                    '.jsx',
                    '.js',
                    ...(useTS ? ['.tsx', '.ts'] : []),
                ])),
            };
            /**
             * Babel loader configuration
             */
            const babelLoader = {
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                targets: 'defaults',
                            },
                        ],
                        [
                            '@babel/preset-react',
                            {
                                runtime: 'automatic',
                                development: isDev,
                            },
                        ],
                        ...(useTS ? ['@babel/preset-typescript'] : []),
                    ],
                    plugins: isDev ? ['react-refresh/babel'] : [],
                },
            };

            const reactRule: RuleSetRule = {
                test: useTS ? /\.(ts|tsx)$/ : /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [babelLoader],
            };
            /**
             * Prevent rule duplication
             */
            const existingRules = config.module?.rules || [];

            const hasReactRule = existingRules.some(rule => {
                return (
                    rule &&
                    typeof rule === 'object' &&
                    'test' in rule &&
                    rule.test?.toString().includes(useTS ? 'tsx' : 'jsx')
                );
            });

            if (!hasReactRule) {
                config.module = {
                    ...config.module,
                    rules: [...existingRules, reactRule],
                };
            }
            /**
             * React Fast Refresh (development only)
             */
            if (isDev) {
                try {
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
                    const plugins = config.plugins || [];

                    const hasPlugin = plugins.some(
                        p =>
                            p &&
                            typeof p === 'object' &&
                            p.constructor?.name === 'ReactRefreshPlugin'
                    );

                    if (!hasPlugin) {
                        plugins.push(new ReactRefreshPlugin());
                        config.plugins = plugins;
                    }
                } catch {
                    /**
                     * Do not throw — keep build stable
                     */
                    console.warn(
                        '\n[react-preset] Warning: "@pmmmwh/react-refresh-webpack-plugin" not found.\n' +
                        'Fast Refresh is disabled. Install it to enable better DX.\n'
                    );
                }
            }
        },

        /**
         * Development-specific configuration
         */
        applyDev(config: Configuration) {
            config.devtool = 'eval-source-map';
        },

        /**
         * Production-specific configuration
         */
        applyProd(config: Configuration) {
            config.devtool = 'source-map';
        },
    };
}
