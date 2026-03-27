import fs from 'fs-extra';
import path from 'path';

const IGNORED_DIRS = [
    'node_modules',
    'dist',
];

const IGNORED_FILES = [
    'package-lock.json',
    'pnpm-lock.yaml',
    'yarn.lock',
    'bun.lockb'
];

/**
 * Copies a template directory into a target directory.
 * Assumes the target directory does NOT exist.
 * Automatically ignores development-only directories (e.g., node_modules)
 * and package manager lock files.
 *
 * @param {string} templatePath - The path to the source template directory.
 * @param {string} targetDir - The path to the destination directory.
 * @returns {Promise<void>} A promise that resolves when the copy operation completes.
 */
export async function copyTemplate(
    templatePath: string,
    targetDir: string
): Promise<void> {
    await fs.copy(templatePath, targetDir, {
        filter: (src) => {
            const relative = path.relative(templatePath, src);

            if (!relative) return true;

            // ignore dirs
            if (IGNORED_DIRS.some(dir =>
                relative === dir || relative.startsWith(`${dir}${path.sep}`)
            )) {
                return false;
            }

            // ignore lock files
            return !IGNORED_FILES.includes(path.basename(src));
        }
    });
}
