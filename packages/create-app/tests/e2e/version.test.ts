import {describe, it} from 'vitest';
import {runCLI} from '../helpers/run-cli';

describe('CLI Version Flag', () => {

    it('should display version with --version', async () => {
        await runCLI(['--version'], {expectedExitCode: 0});
    });

    it('should display version with -v', async () => {
        await runCLI(['-v'], {expectedExitCode: 0});
    });

    it.each(['version', 'Version', 'V', 'v'])(
        'should fail for invalid version command: %s',
        async (cmd) => {
            await runCLI([cmd], {expectedExitCode: 1});
        }
    );
});
