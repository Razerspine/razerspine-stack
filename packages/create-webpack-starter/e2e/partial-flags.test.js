import { runCLI } from './helpers/run-cli.js';
import { createTempDir } from './helpers/temp-dir.js';

(async () => {
  const cwd = createTempDir();
  const projectName = 'test-partial-flags';

  await runCLI(
    [
      projectName,
      '--style',
      'scss'
    ],
    {
      cwd,
      expectedExitCode: 1
    }
  );

  console.log('✅ partial-flags.test.js passed');
})();
