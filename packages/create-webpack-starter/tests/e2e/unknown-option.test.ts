import {describe, it, beforeAll, afterAll} from 'vitest';
import fs from 'node:fs';
import {runCLI} from '../helpers/run-cli';
import {createTempDir} from '../helpers/temp-dir';

describe('Unknown Options', () => {
    let cwd: string;

    beforeAll(() => {
        cwd = createTempDir();
    });

    afterAll(() => {
        fs.rmSync(cwd, {recursive: true, force: true});
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
