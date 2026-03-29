import {describe, it, beforeEach, afterEach} from 'vitest';
import {runCLI} from '../helpers/run-cli';
import {createTempDir} from '../helpers/temp-dir';
import {cleanupDirectory} from '../helpers/cleanup-directory';

describe('Unknown Options', () => {
    let cwd: string;

    beforeEach(() => {
        cwd = createTempDir();
    });

    afterEach(() => {
        cleanupDirectory(cwd);
    });

    it('should fail when using non-existent template option', async () => {
        await runCLI(
            ['test-unknown-option', '--template', 'scss-ts'],
            {cwd, expectedExitCode: 1}
        );
    });

    it('should fail when using an unknown flag', async () => {
        await runCLI(
            ['test-unknown-option', '--unknown'],
            {cwd, expectedExitCode: 1}
        );
    });
});
