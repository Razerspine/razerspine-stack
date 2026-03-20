/**
 * @module snapshot-helper
 * @description Utilities for sanitizing Webpack configurations to ensure stable and readable snapshots across different environments and OS.
 */

import path from 'path';

/**
 * Recursively scans and transforms values to remove environment-specific data.
 * - Replaces absolute project paths with <PROJECT_ROOT>.
 * - Normalizes RegEx strings (converts backslashes to forward slashes).
 * - Simplifies complex plugin objects to their constructor names (except for specific tracked plugins).
 * @param {any} val - The value to sanitize (primitive, array, or object).
 * @param {string} root - The absolute path of the monorepo root to be replaced.
 * @returns {any} The sanitized, environment-agnostic value.
 */
export function sanitizePaths(val: any, root: string): any {
    if (typeof val === 'string') {
        // Replace all occurrences of the root path with a generic placeholder
        return val.split(root).join('<PROJECT_ROOT>');
    }

    if (Array.isArray(val)) {
        return val.map(item => sanitizePaths(item, root));
    }

    if (val !== null && typeof val === 'object') {
        // Handle Regular Expressions: convert to string and normalize slashes for cross-platform consistency
        if (val instanceof RegExp) {
            return val.toString().replace(/\\\\/g, '/');
        }

        // Handle Class Instances (Webpack Plugins, etc.)
        if (val.constructor && val.constructor.name !== 'Object' && val.constructor.name !== 'Array') {
            // Special Case: HtmlTemplatesPlugin
            // We keep its properties to verify template entry logic in snapshots
            if (val.constructor.name === 'HtmlTemplatesPlugin') {
                return {
                    constructorName: 'HtmlTemplatesPlugin',
                    options: sanitizePaths({...val}, root)
                };
            }

            // For other plugins, return only the name to keep snapshots concise and avoid massive object dumps
            return val.constructor.name;
        }

        // Recursively clean standard objects
        const cleaned: Record<string, any> = {};
        for (const key in val) {
            if (Object.prototype.hasOwnProperty.call(val, key)) {
                cleaned[key] = sanitizePaths(val[key], root);
            }
        }
        return cleaned;
    }

    return val;
}

/**
 * Prepares a Webpack configuration object for Vitest snapshot testing.
 * It automatically calculates the monorepo root path to ensure that loaders and
 * node_modules paths are correctly sanitized even when tests run within a package subdirectory.
 * * @param {any} config - The generated Webpack configuration object.
 * @returns {any} A sanitized configuration object safe for cross-environment snapshot matching.
 */
export function normalizeConfigForSnapshot(config: any): any {
    const currentDir = process.cwd();

    // In a monorepo, if we are inside 'packages/build', we need to go up to the workspace root
    // to sanitize paths like <PROJECT_ROOT>/node_modules correctly.
    const projectRoot = currentDir.includes('packages')
        ? path.resolve(currentDir, '../../')
        : currentDir;

    return sanitizePaths(config, projectRoot);
}
