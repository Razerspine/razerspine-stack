import {runCLI} from './helpers/run-cli.js';

(async () => {
  console.log('Testing CLI help flag');

  await runCLI(
    ['--help'],
    {expectedExitCode: 0}
  );

  await runCLI(
    ['-h'],
    {expectedExitCode: 0}
  );

  await runCLI(
    ['help'],
    {expectedExitCode: 1}
  );

  await runCLI(
    ['Help'],
    {expectedExitCode: 1}
  );

  await runCLI(
    ['H'],
    {expectedExitCode: 1}
  )

  await runCLI(
    ['h'],
    {expectedExitCode: 1}
  )

  console.log('✅ help.test.js passed');
})();
