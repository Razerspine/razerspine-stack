import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

/**
 * Resolve current file directory (ESM-safe __dirname replacement)
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Options for running the CLI in tests.
 */
export interface RunCliOptions {
    /**
     * Working directory where the CLI process will be executed.
     * Defaults to current process cwd.
     */
    cwd?: string;

    /**
     * Expected exit code from the CLI process.
     * Defaults to 0.
     */
    expectedExitCode?: number;

    /**
     * Maximum execution time in milliseconds before killing the process.
     * Defaults to 15000 (15 seconds).
     */
    timeoutMs?: number;
}

/**
 * Result returned after CLI execution.
 */
export interface RunCliResult {
    /**
     * Captured stdout output.
     */
    stdout: string;

    /**
     * Captured stderr output.
     */
    stderr: string;

    /**
     * Exit code returned by the process.
     */
    exitCode: number;
}

/**
 * Finds the local `tsx` binary by traversing up the directory tree.
 *
 * This ensures compatibility with:
 * - monorepos
 * - hoisted node_modules
 * - nested package structures
 *
 * @param startPath - directory to start searching from
 * @returns absolute path to tsx binary
 *
 * @throws if tsx binary cannot be found
 */
function findTsxBinary(startPath: string): string {
    let current = startPath;

    while (current !== path.parse(current).root) {
        const binary = path.join(current, 'node_modules', '.bin', 'tsx');

        if (fs.existsSync(binary)) {
            return binary;
        }

        current = path.dirname(current);
    }

    throw new Error(
        '❌ Could not find tsx binary in node_modules. Did you run npm install?'
    );
}

/**
 * Runs the CLI using `tsx` (TypeScript runtime) and captures output.
 *
 * This helper is designed for E2E testing and:
 * - executes the real CLI entry (`src/index.ts`)
 * - captures stdout and stderr
 * - validates exit codes
 * - protects against hanging processes via timeout
 *
 * @example
 * ```ts
 * const result = await runCLI(['my-app', '--dry-run']);
 * expect(result.stdout).toContain('Done!');
 * ```
 *
 * @param args - CLI arguments (same as passing via terminal)
 * @param options - execution options
 *
 * @returns CLI execution result (stdout, stderr, exitCode)
 *
 * @throws if:
 * - process exits with unexpected code
 * - process times out
 * - spawn fails
 */
export function runCLI(
    args: string[] = [],
    options: RunCliOptions = {}
): Promise<RunCliResult> {
    const expectedExitCode = options.expectedExitCode ?? 0;
    const timeoutMs = options.timeoutMs ?? 15000;

    return new Promise((resolve, reject) => {
        const packageRoot = path.resolve(__dirname, '../../');
        const cliPath = path.resolve(packageRoot, 'src/index.ts');

        let tsxBinary: string;

        try {
            tsxBinary = findTsxBinary(packageRoot);
        } catch (err) {
            return reject(err);
        }

        const child = spawn(
            tsxBinary,
            [cliPath, ...args],
            {
                cwd: options.cwd,
                stdio: 'pipe',
            }
        );

        let stdout = '';
        let stderr = '';

        child.stdout?.on('data', (chunk) => {
            stdout += chunk.toString('utf-8');
        });

        child.stderr?.on('data', (chunk) => {
            stderr += chunk.toString('utf-8');
        });

        const timeout = setTimeout(() => {
            child.kill('SIGKILL');
            reject(new Error('❌ CLI execution timed out'));
        }, timeoutMs);

        child.on('error', (err) => {
            clearTimeout(timeout);
            reject(err);
        });

        child.on('close', (code) => {
            clearTimeout(timeout);

            const exitCode = code ?? 0;

            if (exitCode !== expectedExitCode) {
                return reject(
                    new Error(
                        [
                            `❌ CLI exited with code ${exitCode} (expected: ${expectedExitCode})`,
                            '',
                            '--- stderr ---',
                            stderr || '(empty)',
                            '',
                            '--- stdout ---',
                            stdout || '(empty)',
                        ].join('\n')
                    )
                );
            }

            resolve({
                stdout,
                stderr,
                exitCode,
            });
        });
    });
}
