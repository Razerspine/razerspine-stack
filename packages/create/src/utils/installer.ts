import {spawn} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {PackageManager} from './types';

/**
 * Detects the package manager based on lock files.
 *
 * Priority:
 * 1. pnpm-lock.yaml → pnpm
 * 2. yarn.lock → yarn
 * 3. bun.lockb → bun
 * 4. package-lock.json → npm
 * 5. fallback → npm
 *
 * Note:
 * This detection is best used in an existing project directory.
 * In freshly generated templates (before install), lock files may not exist.
 *
 * @param cwd - Directory to inspect for lock files
 * @returns Detected package manager
 */
export function detectPackageManager(cwd: string): PackageManager {
    if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
    if (fs.existsSync(path.join(cwd, 'yarn.lock'))) return 'yarn';
    if (fs.existsSync(path.join(cwd, 'bun.lockb'))) return 'bun';
    if (fs.existsSync(path.join(cwd, 'package-lock.json'))) return 'npm';

    return 'npm';
}

/**
 * Returns the installation command and arguments for a given package manager.
 *
 * @param pm - Selected package manager
 * @returns Object containing executable command and arguments
 */
function getInstallCommand(pm: PackageManager): { cmd: string; args: string[] } {
    switch (pm) {
        case 'yarn':
            return {cmd: 'yarn', args: ['install']};
        case 'pnpm':
            return {cmd: 'pnpm', args: ['install']};
        case 'bun':
            return {cmd: 'bun', args: ['install']};
        case 'npm':
        default:
            return {cmd: 'npm', args: ['install']};
    }
}

/**
 * Installs project dependencies using the selected or detected package manager.
 *
 * Features:
 * - Supports npm, yarn, pnpm, bun
 * - Allows explicit override via CLI (`--pm`)
 * - Falls back to detection based on lock files (from current working directory)
 * - Provides clear error messages if the process fails
 *
 * @param cwd - Target project directory where dependencies should be installed
 * @param pmOverride - Optional package manager override (from CLI)
 *
 * @returns Promise that resolves on successful install or rejects on failure
 *
 * @example
 * ```ts
 * await installDeps('/path/to/project', 'pnpm');
 * ```
 */
export function installDeps(
    cwd: string,
    pmOverride?: PackageManager
): Promise<void> {
    const pm = pmOverride ?? detectPackageManager(process.cwd());
    const {cmd, args} = getInstallCommand(pm);

    console.log(`📦 Installing dependencies using ${pm}...`);

    return new Promise((resolve, reject) => {
        const child = spawn(cmd, args, {
            cwd,
            stdio: 'inherit',
            shell: process.platform === 'win32',
        });

        child.on('error', (err) => {
            reject(
                new Error(
                    `Failed to start ${pm}. Make sure it is installed.\n${err.message}`
                )
            );
        });

        child.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(
                    new Error(`${pm} install failed with exit code ${code}`)
                );
            }
        });
    });
}
