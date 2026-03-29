import {runCLI} from '../helpers/run-cli';
import {createTempDir} from '../helpers/temp-dir';
import {cleanupDirectory} from '../helpers/cleanup-directory';
import {describe, it, beforeEach, afterEach} from 'vitest';

describe('Invalid Values Handling', () => {
    let cwd: string;

    beforeEach(() => {
        cwd = createTempDir();
    });

    afterEach(() => {
        cleanupDirectory(cwd);
    });

    it('should fail when missing required flags', async () => {
        await runCLI(
            ['test-validation', '--app-type', 'mpa', '--style', 'scss'],
            {cwd, expectedExitCode: 1}
        );
    });

    it('should fail when providing an invalid app-type', async () => {
        await runCLI(
            ['test-validation', '--app-type', 'desktop', '--style', 'scss', '--script', 'js'],
            {cwd, expectedExitCode: 1}
        );
    });

    it('should fail when providing an invalid style type', async () => {
        await runCLI(
            ['test-validation', '--app-type', 'spa', '--style', 'tailwind', '--script', 'ts'],
            {cwd, expectedExitCode: 1}
        );
    });
});
