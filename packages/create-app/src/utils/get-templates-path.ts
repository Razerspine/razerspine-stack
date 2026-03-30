import path from 'path';

/**
 * Gets the absolute path to the templates directory ('templates' folder in the package root).
 * Automatically adjusts based on the environment (development or compiled package).
 * @returns {string} Absolute path to the templates' directory.
 */
export function getTemplatesPath(): string {
    // If the execution path ends with 'dist' (or '\dist' on Windows),
    // it means this is a production build (e.g., running via npx)
    const isProd =
        __dirname.endsWith('dist') || __dirname.endsWith(path.sep + 'dist');

    if (isProd) {
        // Relative to dist/index.cjs, the templates folder is one level up
        return path.resolve(__dirname, '../templates');
    }

    // For development mode (assuming this helper is located in, e.g., src/utils/get-templates-path.ts)
    // We go up two levels from src/utils to the package root
    return path.resolve(__dirname, '../../templates');
}
