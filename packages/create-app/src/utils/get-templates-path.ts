import path from 'node:path';

/**
 * Gets the absolute path to the templates directory ('templates' folder in the package root).
 * Automatically adjusts based on the environment (development or compiled package).
 *
 * Detection strategy: checks if __dirname ends with 'dist' (compiled output via tsup).
 * - Production (dist/): __dirname = {pkg-root}/dist → templates is one level up
 * - Development (src/utils/): __dirname = {pkg-root}/src/utils → templates is two levels up
 *
 * @returns {string} Absolute path to the templates' directory.
 */
export function getTemplatesPath(): string {
    const isProd =
        __dirname.endsWith('dist') || __dirname.endsWith(path.sep + 'dist');

    if (isProd) {
        return path.resolve(__dirname, '../templates');
    }

    return path.resolve(__dirname, '../../templates');
}
