import {webpack, Configuration, Stats} from 'webpack';
import * as path from 'path';
import {vi} from 'vitest';
import {createBaseConfig, createProdConfig, ConfigOptionType} from '../../src';

/**
 * Runs Webpack compiler as a Promise
 */
export function runWebpack(config: Configuration): Promise<Stats> {
    return new Promise((resolve, reject) => {
        webpack(config, (err, stats) => {
            if (err) return reject(err);
            if (stats?.hasErrors()) {
                return reject(new Error(stats.toString({errors: true})));
            }
            resolve(stats!);
        });
    });
}

/**
 * Encapsulates the boilerplate for E2E build tests
 */
export async function executeTestBuild(fixtureName: string, options: ConfigOptionType): Promise<{
    stats: Stats;
    outDir: string;
    fixturePath: string;
}> {
    try {
        const fixturePath = path.resolve(__dirname, '../fixtures', fixtureName);
        const outDir = path.resolve(fixturePath, 'dist');
        const coreNodeModules = path.resolve(__dirname, '../../node_modules');

        // Mock CWD for the current fixture
        vi.spyOn(process, 'cwd').mockReturnValue(fixturePath);

        const baseConfig = createBaseConfig(options);

        // Ensure loaders are resolved from both fixture and core node_modules
        baseConfig.resolveLoader = {
            modules: [
                path.join(fixturePath, 'node_modules'),
                coreNodeModules,
                'node_modules'
            ],
        };

        // Standard extensions for TS projects if needed
        if (options.scripts === 'ts') {
            if (!baseConfig.resolve) baseConfig.resolve = {};
            baseConfig.resolve.extensions = ['.ts', '.js', '.json'];
        }

        const prodConfig = createProdConfig(baseConfig);
        const stats = await runWebpack(prodConfig);

        return {
            stats,
            outDir,
            fixturePath
        };
    } catch (err) {
        return Promise.reject(err);
    }
}
