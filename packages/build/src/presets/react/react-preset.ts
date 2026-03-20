/**
 * @module react-preset
 * @description Build preset for React applications (TSX / JSX support)
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
         * Setup phase
         */
        setup() {
        },

        /**
         * Base config extension
         */
        applyBase(config: Configuration) {
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
                ...(config.resolve || {}),
                extensions: Array.from(new Set([
                    ...(config.resolve?.extensions || []),
                    ...(useTS
                        ? ['.tsx', '.ts']
                        : ['.jsx']),
                ])),
            };

            /**
             * Rules
             */
            const rules = config.module?.rules || [];

            const reactRule: RuleSetRule = useTS
                ? {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                }
                : {
                    test: /\.jsx?$/,
                    use: 'babel-loader',
                    exclude: /node_modules/,
                };

            config.module = {
                ...(config.module || {}),
                rules: [...rules, reactRule],
            };
        },

        /**
         * Dev-specific logic (optional)
         */
        applyDev() {
        },

        /**
         * Prod-specific logic (optional)
         */
        applyProd() {
        },
    };
}
