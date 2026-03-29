import {runCLI} from '../helpers/run-cli';
import {createTempDir} from '../helpers/temp-dir';
import {cleanupDirectory} from '../helpers/cleanup-directory';
import {describe, it, beforeEach, afterEach} from 'vitest';

describe('Partial Flags Validation', () => {
    let cwd: string;

    beforeEach(() => {
        cwd = createTempDir();
    });

    afterEach(() => {
        cleanupDirectory(cwd);
    });

    it('should fail if only a subset of required flags is provided', async () => {
        await runCLI(
            ['test-partial-flags', '--app-type', 'spa', '--style', 'scss'],
            {cwd, expectedExitCode: 1}
        );
    });
});
