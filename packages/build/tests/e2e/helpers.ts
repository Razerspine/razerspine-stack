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
 * Encapsulates the boilerplate for E2E build tests.
 * Runs the Webpack build process for a specific fixture and returns the output directory.
 * @param fixtureRelativePath - Path relative to the fixtures directory (e.g., 'mpa/js-scss' or 'spa/ts-less')
 * @param options - Configuration options for the build
 * @returns A promise that resolves to an object containing stats, outDir, and fixturePath
 */
export async function executeTestBuild(
    fixtureRelativePath: string,
    options: ConfigOptionType
): Promise<{
    stats: Stats;
    outDir: string;
    fixturePath: string;
}> {
    try {
        // Absolute path to the specific fixture combination (e.g., fixtures/mpa/js-scss)
        const fixturePath = path.resolve(__dirname, '../fixtures', fixtureRelativePath);

        // Build output directory (dist) will be created inside the fixture folder
        const outDir = path.resolve(fixturePath, 'dist');

        // Path to the core package's node_modules to find loaders and plugins
        const coreNodeModules = path.resolve(__dirname, '../../node_modules');

        // Extract the root fixture directory (e.g., 'mpa' or 'spa') where package.json is located
        const appTypeRoot = fixtureRelativePath.split('/')[0];
        const fixtureRootPath = path.resolve(__dirname, '../fixtures', appTypeRoot);

        // Mock Current Working Directory (CWD) so Webpack treats the fixture folder as the project root
        vi.spyOn(process, 'cwd').mockReturnValue(fixturePath);

        // Generate base Webpack configuration based on provided options
        const baseConfig = createBaseConfig(options);

        // Configure where Webpack should look for loaders (babel, sass, ts-loader, etc.)
        baseConfig.resolveLoader = {
            modules: [
                path.join(fixtureRootPath, 'node_modules'), // Look in fixtures/[mpa|spa]/node_modules
                coreNodeModules,                            // Look in core package node_modules
                'node_modules'                              // Default fallback
            ],
        };

        // Inject standard TypeScript extensions for TS-based fixtures
        if (options.scripts === 'ts') {
            if (!baseConfig.resolve) baseConfig.resolve = {};

            // Ensure the extensions array exists and extend it
            baseConfig.resolve.extensions = [
                ...(baseConfig.resolve.extensions || []),
                '.ts', '.js', '.json'
            ];
        }

        // Apply production-specific optimizations and configurations
        const prodConfig = createProdConfig(baseConfig);

        // Execute the Webpack compilation
        const stats = await runWebpack(prodConfig);

        return {
            stats,
            outDir,
            fixturePath
        };
    } catch (err) {
        // Reject the promise if any error occurs during the build setup or execution
        return Promise.reject(err);
    }
}
