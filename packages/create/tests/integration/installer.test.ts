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
        vi.spyOn(console, 'log').mockImplementation(() => {
        });
    });

    afterEach(() => {
        cleanupDirectory(tempDir);
        vi.restoreAllMocks();
    });

    const mockSpawnProcess = (event: 'close' | 'error', value: number | Error) => {
        const mockChild = {
            on: vi.fn((ev, cb) => {
                if (ev === event) {
                    setImmediate(() => cb(value));
                }
                return mockChild;
            })
        };
        vi.mocked(spawn).mockReturnValue(mockChild as any);
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

        expect(spawn).toHaveBeenCalledWith('pnpm', ['install'], expect.any(Object));
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
