/**
 * @module define-config
 * @description User-friendly configuration wrapper for building Webpack configs.
 *
 * Provides:
 * - Cleaner API for users
 * - Support for dynamic and async config
 * - Presets support (mapped to buildPlugins)
 * - devServer overrides via `devServer` field (passed to createDevConfig)
 * - Production Webpack overrides via `prod` field (passed to createProdConfig)
 *
 * Does NOT modify Webpack behavior directly.
 * Delegates all logic to core config creators.
 */

import {ConfigOptionType, ModeType, BuildPluginType} from '../types';
import {createBaseConfig} from './create-base-config';
import {createDevConfig} from './create-dev-config';
import {createProdConfig} from './create-prod-config';
import {Configuration} from 'webpack';
import type {Configuration as DevServerConfiguration} from 'webpack-dev-server';

/**
 * Environment passed to config factory function.
 */
type DefineEnv = {
    mode: ModeType;
};

/**
 * Extended config accepted by `defineConfig`.
 *
 * Extends `ConfigOptionType` with:
 * - `presets`   — syntactic sugar over `buildPlugins`
 * - `devServer` — DevServer overrides, merged on top of the default dev server config
 * - `prod`      — Webpack overrides applied only in production, merged on top of the default prod config
 */
type ExtendedConfig = ConfigOptionType & {
    /**
     * Optional presets (syntactic sugar for buildPlugins).
     * Presets are appended after any explicit `buildPlugins`.
     *
     * @example
     * ```ts
     * import {defineConfig, reactPreset} from '@razerspine/build';
     *
     * export default defineConfig({
     *   presets: [reactPreset()]
     * });
     * ```
     */
    presets?: BuildPluginType[];

    /**
     * DevServer overrides passed directly to `createDevConfig`.
     * Merged on top of the default devServer settings.
     * Only applied in `development` mode.
     *
     * Common use cases: custom port, proxy, HTTPS, headers.
     *
     * @example
     * ```ts
     * defineConfig({
     *   devServer: {
     *     port: 3000,
     *     proxy: { '/api': 'http://localhost:4000' },
     *   }
     * })
     * ```
     *
     * @see createDevConfig
     */
    devServer?: DevServerConfiguration;

    /**
     * Additional Webpack overrides applied only in production.
     * Passed as the second argument to `createProdConfig` and merged last —
     * so these settings take priority over all internal production defaults.
     *
     * Common use cases: custom output paths, optimization tweaks, performance hints.
     *
     * @example
     * ```ts
     * defineConfig({
     *   prod: {
     *     optimization: { minimize: false },
     *     performance: { hints: 'warning' },
     *   }
     * })
     * ```
     *
     * @see createProdConfig
     */
    prod?: Configuration;
};

/**
 * Supported config input formats for `defineConfig`:
 *
 * - Static object config
 * - Synchronous factory function `(env) => config`
 * - Asynchronous factory function `async (env) => config`
 */
type DefineConfigInput =
    | ExtendedConfig
    | ((env: DefineEnv) => ExtendedConfig)
    | ((env: DefineEnv) => Promise<ExtendedConfig>);

/**
 * Return type of `defineConfig`.
 * Always a Webpack-compatible factory function.
 */
type DefineConfigReturn = (
    env?: { mode?: ModeType }
) => Configuration | Promise<Configuration>;

/**
 * Extracts `defineConfig`-only fields from the raw config
 * and returns a clean `ConfigOptionType` for the core pipeline.
 *
 * Responsibilities:
 * - maps `presets` → appended to `buildPlugins`
 * - strips `devServer` and `prod` (handled separately in resolveConfig)
 */
function normalizeConfig(config: ExtendedConfig): ConfigOptionType {
    const {presets, buildPlugins, devServer: _devServer, prod: _prod, ...rest} = config;

    return {
        ...rest,
        buildPlugins: [
            ...(buildPlugins || []),
            ...(presets || []),
        ],
    };
}

/**
 * Internal async config resolver.
 *
 * Flow:
 * 1. Resolves the raw config (static / function / async function)
 * 2. Normalizes it into `ConfigOptionType` (strips defineConfig-only fields)
 * 3. Creates base config via `createBaseConfig`
 * 4. Branches into dev or prod:
 *    - dev  → `createDevConfig(base, devServer)`
 *    - prod → `createProdConfig(base, prod)`
 */
async function resolveConfig(
    input: DefineConfigInput,
    env?: {
        mode?: ModeType
    }
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
        return createDevConfig(base, rawConfig.devServer ?? {});
    }

    return createProdConfig(base, rawConfig.prod ?? {});
}

/**
 * Main config helper for `@razerspine/build`.
 *
 * Accepts a static config object, a synchronous factory, or an async factory.
 * Always returns a Webpack-compatible factory function — compatible with `webpack --env`.
 *
 * @example Static config:
 * ```ts
 * import {defineConfig} from '@razerspine/build';
 *
 * export default defineConfig({
 *   scripts: 'ts',
 *   styles: 'scss',
 *   templates: { type: 'pug', entry: 'src/views/app.pug' },
 * });
 * ```
 *
 * @example With devServer and prod overrides:
 * ```ts
 * export default defineConfig({
 *   scripts: 'ts',
 *   styles: 'scss',
 *   devServer: {
 *     port: 3000,
 *     proxy: { '/api': 'http://localhost:4000' },
 *   },
 *   prod: {
 *     optimization: { minimize: false },
 *   },
 * });
 * ```
 *
 * @example Dynamic (function) config:
 * ```ts
 * export default defineConfig(({ mode }) => ({
 *   mode,
 *   scripts: 'ts',
 *   styles: 'scss',
 * }));
 * ```
 *
 * @example Async config:
 * ```ts
 * export default defineConfig(async ({ mode }) => {
 *   const env = await loadEnv(mode);
 *   return { mode, scripts: 'ts', styles: 'scss' };
 * });
 * ```
 *
 * @example With presets:
 * ```ts
 * import {defineConfig, reactPreset} from '@razerspine/build';
 *
 * export default defineConfig({
 *   scripts: 'ts',
 *   styles: 'scss',
 *   templates: { type: 'none' },
 *   presets: [reactPreset()],
 * });
 * ```
 *
 * @remarks
 * - Always returns a function (Webpack-compatible factory)
 * - Supports static, dynamic, and async config formats
 * - Mode is resolved from: `config.mode` → `env.mode` (CLI `--mode`) → `'development'` (default)
 * - `devServer` overrides are only applied in development mode
 * - `prod` overrides are only applied in production mode
 * - For advanced use cases, prefer `buildPlugins` lifecycle hooks
 */
export function defineConfig(input: DefineConfigInput): DefineConfigReturn {
    return (env) => {
        return resolveConfig(input, env);
    };
}
