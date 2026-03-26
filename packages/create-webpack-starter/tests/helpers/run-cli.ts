import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface RunCliOptions {
    cwd?: string;
    expectedExitCode?: number;
}

function findTsxBinary(startPath: string): string {
    let current = startPath;
    while (current !== path.parse(current).root) {
        const binary = path.join(current, 'node_modules', '.bin', 'tsx');
        if (fs.existsSync(binary)) return binary;
        current = path.dirname(current);
    }
    throw new Error('❌ Could not find tsx binary in any node_modules. Did you run npm install?');
}

export function runCLI(args: string[] = [], options: RunCliOptions = {}): Promise<void> {
    const expectedExitCode = options.expectedExitCode ?? 0;

    return new Promise((resolve, reject) => {
        const packageRoot = path.resolve(__dirname, '../../');
        const cliPath = path.resolve(packageRoot, 'src/index.ts');

        try {
            const tsxBinary = findTsxBinary(packageRoot);

            const child = spawn(
                tsxBinary,
                [cliPath, ...args],
                {
                    cwd: options.cwd,
                    stdio: 'inherit',
                    shell: process.platform === 'win32',
                }
            );

            child.on('error', reject);

            child.on('close', (code) => {
                if (code !== expectedExitCode) {
                    reject(new Error(`CLI exited with code ${code} (expected: ${expectedExitCode})`));
                } else {
                    resolve();
                }
            });
        } catch (err) {
            reject(err);
        }
    });
}
