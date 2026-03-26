import fs from 'node:fs';
import {runCLI} from '../helpers/run-cli';
import {createTempDir} from '../helpers/temp-dir';

describe('Partial Flags Validation', () => {
    let cwd: string;

    beforeAll(() => {
        cwd = createTempDir();
    });

    afterAll(() => {
        fs.rmSync(cwd, {recursive: true, force: true});
    });

    it('should fail if only a subset of required flags is provided', async () => {
        await runCLI(
            ['test-partial-flags', '--app-type', 'spa', '--style', 'scss'],
            {cwd, expectedExitCode: 1}
        );
    });
});
