import {runCLI} from './helpers/run-cli.js';
import {createTempDir} from './helpers/temp-dir.js';

(async () => {
  const cwd = createTempDir();
  const projectName = 'test-validation';

  console.log('Testing CLI validation and error handling...');

  await runCLI(
    [projectName, '--app-type', 'mpa', '--style', 'scss'],
    {cwd, expectedExitCode: 1}
  );

  await runCLI(
    [projectName, '--app-type', 'desktop', '--style', 'scss', '--script', 'js'],
    {cwd, expectedExitCode: 1}
  );

  await runCLI(
    [projectName, '--app-type', 'spa', '--style', 'tailwind', '--script', 'ts'],
    {cwd, expectedExitCode: 1}
  );

  console.log('✅ invalid-values.test.js passed');
})();
