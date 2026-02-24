import {runCLI} from './helpers/run-cli.js';

(async () => {
  console.log('Testing CLI version flag');

  await runCLI(
    ['--version'],
    {expectedExitCode: 0}
  );

  await runCLI(
    ['-v'],
    {expectedExitCode: 0}
  );

  console.log('✅ version.test.js passed');
})();
