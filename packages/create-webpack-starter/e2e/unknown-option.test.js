import {runCLI} from './helpers/run-cli.js';
import {createTempDir} from './helpers/temp-dir.js';

(async () => {
  const cwd = createTempDir();
  const projectName = 'test-unknown-option';

  await runCLI(
    [
      projectName,
      '--template',
      'scss-ts'
    ],
    {
      cwd,
      expectedExitCode: 1
    }
  );

  console.log('✅ unknown-option.test.js passed');
})();
