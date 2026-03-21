/**
 * @module define-config
 * @description User-friendly config wrapper
 */

import {ConfigOptionType, ModeType} from '../types';
import {createBaseConfig} from './create-base-config';
import {createDevConfig} from './create-dev-config';
import {createProdConfig} from './create-prod-config';
import {Configuration} from 'webpack';

type DefineEnv = {
    mode?: ModeType;
};

type DefineConfigReturn =
    | Configuration
    | ((env?: DefineEnv) => Configuration);

/**
 * Config helper for cleaner and more scalable setup.
 *
 * - Centralizes config creation
 * - Improves DX and typing
 * - Supports dynamic mode resolution
 */
export function defineConfig(
    options: ConfigOptionType
): DefineConfigReturn {
    return (env?: DefineEnv) => {
        const mode: ModeType = env?.mode ?? options.mode;

        const base = createBaseConfig({
            ...options,
            mode,
        });

        if (mode === 'development') {
            return createDevConfig(base);
        }

        return createProdConfig(base);
    };
}
