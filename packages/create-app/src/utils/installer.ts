import {spawn} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {PackageManager} from './types';

/**
 * Detects the package manager based on the user agent, package.json, or lock files.
 *
 * Priority:
 * 1. process.env.npm_config_user_agent — set by the invoking PM (pnpm run, yarn dlx, bunx, npx).
 *    Most reliable when the CLI is run via a PM script or dlx command.
 * 2. "packageManager" field in package.json — explicit Corepack declaration (e.g. "pnpm@10.33.0").
 *    Catches the case where the user invokes via npx but the project declares a specific PM.
 * 3. Lock files — implicit signal from an existing install.
 *    pnpm-lock.yaml → pnpm
 *    yarn.lock      → yarn
 *    bun.lockb      → bun  (Bun < 1.2)
 *    bun.lock       → bun  (Bun ≥ 1.2)
 *    package-lock.json → npm
 * 4. Fallback → npm
 *
 * @param cwd - Directory to inspect for package.json and lock files
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

    const pkgJsonPath = path.join(cwd, 'package.json');
    if (fs.existsSync(pkgJsonPath)) {
        try {
            const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8')) as {packageManager?: unknown};
            const pm = pkg.packageManager;
            if (typeof pm === 'string') {
                if (pm.startsWith('pnpm')) return 'pnpm';
                if (pm.startsWith('yarn')) return 'yarn';
                if (pm.startsWith('bun')) return 'bun';
                if (pm.startsWith('npm')) return 'npm';
            }
        } catch {
            // Ignore malformed package.json
        }
    }

    if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
    if (fs.existsSync(path.join(cwd, 'yarn.lock'))) return 'yarn';
    if (fs.existsSync(path.join(cwd, 'bun.lockb'))) return 'bun';
    if (fs.existsSync(path.join(cwd, 'bun.lock'))) return 'bun';
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
