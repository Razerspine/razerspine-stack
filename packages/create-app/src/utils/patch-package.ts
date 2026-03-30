import fs from 'node:fs/promises';
import path from 'node:path';
import {PackageManager} from './types';

/**
 * Patches package.json:
 * - sets project name
 * - adapts scripts to selected package manager
 * - injects packageManager field
 */
export async function patchPackageJson(
    targetDir: string,
    projectName: string,
    pm: PackageManager
): Promise<void> {
    const pkgPath = path.join(targetDir, 'package.json');

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
}
