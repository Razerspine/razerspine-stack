/**
 * @module react-preset
 * @description Production-ready React preset (Babel + Fast Refresh + TS/JSX)
 */

import {BuildPluginType} from '../../types';
import {Configuration, RuleSetRule} from 'webpack';

type ReactPresetOptions = {
    typescript?: boolean;
};

export function reactPreset(options: ReactPresetOptions = {}): BuildPluginType {
    const useTS = options.typescript ?? true;

    return {
        name: 'react-preset',
        /**
         * Base config extension
         */
        applyBase(config: Configuration) {
            const isDev = config.mode === 'development';
            /**
             * Entry
             */
            if (!config.entry) {
                config.entry = useTS
                    ? './src/main.tsx'
                    : './src/main.jsx';
            }
            /**
             * Resolve
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
             * Babel loader rule (React + Env + TS)
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
             * React Refresh (DEV ONLY)
             */
            if (isDev) {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
                const plugins = config.plugins || [];

                const hasPlugin = plugins.some(
                    p => p && typeof p === 'object' && p.constructor?.name === 'ReactRefreshPlugin'
                );

                if (!hasPlugin) {
                    plugins.push(new ReactRefreshPlugin());
                    config.plugins = plugins;
                }
            }
        },

        /**
         * Dev-specific tweaks
         */
        applyDev(config: Configuration) {
            config.devtool = 'eval-source-map';
        },

        /**
         * Production tweaks
         */
        applyProd(config: Configuration) {
            config.devtool = 'source-map';
        },
    };
}
