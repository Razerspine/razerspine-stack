import {describe, it} from 'vitest';
import {runCLI} from '../helpers/run-cli';

describe('CLI Version Flag', () => {
    it('should display version with --version', async () => {
        await runCLI(['--version'], {expectedExitCode: 0});
    });

    it('should display version with -v', async () => {
        await runCLI(['-v'], {expectedExitCode: 0});
    });

    it('should fail for invalid version commands', async () => {
        const invalidCommands = ['version', 'Version', 'V', 'v'];

        for (const cmd of invalidCommands) {
            await runCLI([cmd], {expectedExitCode: 1});
        }
    });
});
