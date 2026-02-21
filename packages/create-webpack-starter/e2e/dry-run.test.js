import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

import {runCLI} from './helpers/run-cli.js';
import {createTempDir} from './helpers/temp-dir.js';

(async () => {
  const cwd = createTempDir();
  const projectName = 'test-dry-run-app';
  const projectPath = path.join(cwd, projectName);

  await runCLI([projectName, '--app-type', 'mpa', '--style', 'scss', '--script', 'ts', '--dry-run'], {cwd});

  assert.ok(
    !fs.existsSync(projectPath),
    'Project directory should NOT be created in dry-run mode'
  );

  console.log('✅ dry-run.test.js passed');
})();
