import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {spawn} from 'node:child_process';
import {installDeps} from '../../src/utils';
import {createTempDir} from '../helpers/temp-dir';
import {cleanupDirectory} from '../helpers/cleanup-directory';

vi.mock('node:child_process', () => ({
    spawn: vi.fn()
}));

describe('installDeps (Integration)', () => {
    let tempDir: string;

    beforeEach(() => {
        tempDir = createTempDir();
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanupDirectory(tempDir);
        vi.restoreAllMocks();
    });

    const mockSpawnProcess = (
        event: 'close' | 'error',
        value: number | Error
    ) => {
        const handlers: Record<string, Function> = {};

        const mockChild = {
            on: vi.fn((ev, cb) => {
                handlers[ev] = cb;
                return mockChild;
            }),
            stdout: {on: vi.fn()},
            stderr: {on: vi.fn()}
        };

        vi.mocked(spawn).mockReturnValue(mockChild as any);

        setImmediate(() => {
            if (handlers[event]) {
                handlers[event](value);
            }
        });
    };

    it('should execute npm install by default', async () => {
        mockSpawnProcess('close', 0);

        await installDeps(tempDir, 'npm');

        expect(spawn).toHaveBeenCalledWith(
            'npm',
            ['install'],
            expect.objectContaining({cwd: tempDir})
        );
    });

    it('should execute pnpm install when requested', async () => {
        mockSpawnProcess('close', 0);

        await installDeps(tempDir, 'pnpm');

        expect(spawn).toHaveBeenCalledWith(
            'pnpm',
            ['install'],
            expect.objectContaining({cwd: tempDir})
        );
    });

    it('should execute yarn install when requested', async () => {
        mockSpawnProcess('close', 0);

        await installDeps(tempDir, 'yarn');

        expect(spawn).toHaveBeenCalledWith(
            'yarn',
            ['install'],
            expect.objectContaining({cwd: tempDir})
        );
    });

    it('should execute bun install when requested', async () => {
        mockSpawnProcess('close', 0);

        await installDeps(tempDir, 'bun');

        expect(spawn).toHaveBeenCalledWith(
            'bun',
            ['install'],
            expect.objectContaining({cwd: tempDir})
        );
    });

    it('should throw error when package manager exits with non-zero code', async () => {
        mockSpawnProcess('close', 1);

        await expect(installDeps(tempDir, 'yarn'))
            .rejects
            .toThrow('yarn install failed with exit code 1');
    });

    it('should throw error when spawn itself fails (e.g. command not found)', async () => {
        mockSpawnProcess('error', new Error('ENOENT'));

        await expect(installDeps(tempDir, 'bun'))
            .rejects
            .toThrow(/Failed to start bun/);
    });
});
