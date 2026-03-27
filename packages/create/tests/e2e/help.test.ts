import {runCLI} from '../helpers/run-cli';
import {describe, it} from 'vitest';

describe('Help Flag Output', () => {
    it('should exit with code 0 for valid help flags', async () => {
        await runCLI(['--help'], {expectedExitCode: 0});
        await runCLI(['-h'], {expectedExitCode: 0});
    });

    it('should exit with code 1 for invalid help commands', async () => {
        await runCLI(['help'], {expectedExitCode: 1});
        await runCLI(['Help'], {expectedExitCode: 1});
        await runCLI(['H'], {expectedExitCode: 1});
        await runCLI(['h'], {expectedExitCode: 1});
    });
});
