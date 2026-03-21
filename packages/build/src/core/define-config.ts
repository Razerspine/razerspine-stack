/**
 * @module define-config
 * @description User-friendly configuration wrapper for building Webpack configs.
 *
 * Provides:
 * - Cleaner API for users
 * - Support for dynamic and async config
 * - Presets support (mapped to buildPlugins)
 *
 * Does NOT modify Webpack behavior directly.
 * Delegates all logic to core config creators.
 */

import {ConfigOptionType, ModeType, BuildPluginType} from '../types';
import {createBaseConfig} from './create-base-config';
import {createDevConfig} from './create-dev-config';
import {createProdConfig} from './create-prod-config';
import {Configuration} from 'webpack';

/**
 * Environment passed to config factory
 */
type DefineEnv = {
    mode?: ModeType;
};

/**
 * Extended config with presets support
 */
type ExtendedConfig = ConfigOptionType & {
    /**
     * Optional presets (syntactic sugar for buildPlugins)
     */
    presets?: BuildPluginType[];
};

/**
 * Supported config input formats:
 *
 * - Object config
 * - Function config
 * - Async function config
 */
type DefineConfigInput =
    | ExtendedConfig
    | ((env?: DefineEnv) => ExtendedConfig)
    | ((env?: DefineEnv) => Promise<ExtendedConfig>);

/**
 * Output type:
 * - Webpack configuration
 * - Async configuration
 * - Function returning configuration
 */
type DefineConfigReturn =
    | Configuration
    | Promise<Configuration>
    | ((env?: DefineEnv) => Configuration | Promise<Configuration>);

/**
 * Normalize config:
 * - maps `presets` → `buildPlugins`
 */
function normalizeConfig(config: ExtendedConfig): ConfigOptionType {
    const {presets, buildPlugins, ...rest} = config;

    return {
        ...rest,
        buildPlugins: [
            ...(buildPlugins || []),
            ...(presets || []),
        ],
    };
}

/**
 * Internal config resolver
 */
async function resolveConfig(
    input: DefineConfigInput,
    env?: DefineEnv
): Promise<Configuration> {
    const mode: ModeType = env?.mode ?? 'development';

    let rawConfig: ExtendedConfig;

    if (typeof input === 'function') {
        rawConfig = await input({mode});
    } else {
        rawConfig = input;
    }

    const finalOptions = normalizeConfig({
        ...rawConfig,
        mode: rawConfig.mode ?? mode,
    });

    const base = createBaseConfig(finalOptions);

    if (finalOptions.mode === 'development') {
        return createDevConfig(base);
    }

    return createProdConfig(base);
}

/**
 * Main config helper
 *
 * @example
 * ```ts
 * import {defineConfig, reactPreset} from '@razerspine/build';
 *
 * export default defineConfig({
 *   mode: 'development',
 *   scripts: 'ts',
 *   styles: 'scss',
 *   templates: {type: 'none'},
 *   presets: [reactPreset()]
 * });
 * ```
 */
export function defineConfig(input: DefineConfigInput): DefineConfigReturn {
    return (env?: DefineEnv) => {
        return resolveConfig(input, env);
    };
}
