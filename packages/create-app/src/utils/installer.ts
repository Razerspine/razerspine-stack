import {spawn} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {PackageManager} from './types';

/**
 * Detects the package manager based on the user agent or lock files.
 *
 * Priority:
 * 1. process.env.npm_config_user_agent (detects how the CLI was invoked, e.g., npx, pnpm dlx)
 * 2. pnpm-lock.yaml -> pnpm
 * 3. yarn.lock -> yarn
 * 4. bun.lockb / bun.lock -> bun
 * 5. package-lock.json -> npm
 * 6. fallback -> npm
 *
 * Note:
 * Lock file detection is best used in an existing project directory.
 * In freshly generated templates (before install), lock files may not exist,
 * which makes the user agent check the most reliable method for new projects.
 *
 * @param cwd - Directory to inspect for lock files (if user agent detection fails)
 * @returns Detected package manager
 */
export function detectPackageManager(cwd: string): PackageManager {
    const userAgent = process.env.npm_config_user_agent;
    if (userAgent) {
        if (userAgent.startsWith('pnpm')) return 'pnpm';
        if (userAgent.startsWith('yarn')) return 'yarn';
        if (userAgent.startsWith('bun')) return 'bun';
        if (userAgent.startsWith('npm')) return 'npm';
    }

    if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
    if (fs.existsSync(path.join(cwd, 'yarn.lock'))) return 'yarn';
    if (fs.existsSync(path.join(cwd, 'bun.lockb'))) return 'bun';
    if (fs.existsSync(path.join(cwd, 'bun.lock'))) return 'bun'; // Support for Bun 1.2+
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
 * - Falls back to detection based on user agent and lock files (from target directory)
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
    const pm = pmOverride ?? detectPackageManager(cwd);
    const {cmd, args} = getInstallCommand(pm);

    console.log(`📦 Installing dependencies using ${pm}...`);

    return new Promise((resolve, reject) => {
        const isWindows = process.platform === 'win32';
        const child = spawn(isWindows ? `${cmd}.cmd` : cmd, args, {
            cwd,
            stdio: 'inherit',
            shell: false,
        });

        child.on('error', (err) => {
            reject(
                new Error(
                    `Failed to start ${pm}. Make sure it is installed.\n${err.message}`
                )
            );
        });

        child.on('close', (code, signal) => {
            if (code === 0) {
                resolve();
            } else if (code === null) {
                reject(new Error(`${pm} install was terminated by signal ${signal}`));
            } else {
                reject(new Error(`${pm} install failed with exit code ${code}`));
            }
        });
    });
}
