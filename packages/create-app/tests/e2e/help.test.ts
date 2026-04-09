import {runCLI} from '../helpers/run-cli';
import {describe, it} from 'vitest';

describe('Help Flag Output', () => {

    it.each(['--help', '-h'])(
        'should exit with code 0 for valid help flag: %s',
        async (flag) => {
            await runCLI([flag], {expectedExitCode: 0});
        }
    );

    it.each(['help', 'Help', 'H', 'h'])(
        'should exit with code 1 for invalid help command: %s',
        async (cmd) => {
            await runCLI([cmd], {expectedExitCode: 1});
        }
    );
});
