import fs from 'fs-extra';
import path from 'path';

const IGNORED_DIRS = [
    'node_modules',
    'dist',
];

/**
 * Copy template directory into target directory.
 * Assumes targetDir does NOT exist.
 * Ignores development-only directories.
 */
export async function copyTemplate(
    templatePath: string,
    targetDir: string
) {
    await fs.copy(templatePath, targetDir, {
        filter: (src) => {
            const relative = path.relative(templatePath, src);

            // allow root itself
            if (!relative) return true;

            return !IGNORED_DIRS.some((dir) =>
                relative === dir || relative.startsWith(`${dir}${path.sep}`)
            );
        }
    });
}
