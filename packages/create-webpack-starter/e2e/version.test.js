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

  await runCLI(
    ['version'],
    {expectedExitCode: 1}
  );

  await runCLI(
    ['Version'],
    {expectedExitCode: 1}
  );

  await runCLI(
    ['V'],
    {expectedExitCode: 1}
  )

  await runCLI(
    ['v'],
    {expectedExitCode: 1}
  )

  console.log('✅ version.test.js passed');
})();
