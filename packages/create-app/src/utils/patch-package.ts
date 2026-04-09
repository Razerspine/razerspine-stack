import fs from 'node:fs/promises';
import path from 'node:path';
import {PackageManager} from './types';

/**
 * Patches package.json:
 * - sets project name
 * - adapts scripts to selected package manager
 * - injects packageManager field
 * * Includes error handling to ensure safe file reading and JSON parsing.
 *
 * @param targetDir - The path to the destination directory.
 * @param projectName - The name of the project to set.
 * @param pm - The selected package manager.
 * @throws Error if package.json cannot be read or parsed.
 */
export async function patchPackageJson(
    targetDir: string,
    projectName: string,
    pm: PackageManager
): Promise<void> {
    const pkgPath = path.join(targetDir, 'package.json');

    try {
        const content = await fs.readFile(pkgPath, 'utf-8');
        const pkg = JSON.parse(content);

        // name
        pkg.name = projectName;

        // prevent accidental publish
        pkg.private = true;

        // package manager metadata
        pkg.packageManager = `${pm}@latest`;

        const runPrefixes: Record<PackageManager, string> = {
            npm: 'npm run ',
            yarn: 'yarn ',
            pnpm: 'pnpm ',
            bun: 'bun run ',
        };

        const newPrefix = runPrefixes[pm];

        if (pkg.scripts) {
            for (const key of Object.keys(pkg.scripts)) {
                const command = pkg.scripts[key];

                if (typeof command === 'string') {
                    pkg.scripts[key] = command.replace(/\bnpm run\s+/g, newPrefix);
                }
            }
        }

        await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to patch package.json in ${targetDir}: ${errorMessage}`);
    }
}
