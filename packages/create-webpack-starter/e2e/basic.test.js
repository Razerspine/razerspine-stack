import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

import {runCLI} from './helpers/run-cli.js';
import {createTempDir} from './helpers/temp-dir.js';

(async () => {
  const cwd = createTempDir();
  const projectName = 'test-basic-app';
  const projectPath = path.join(cwd, projectName);

  await runCLI(
    [
      projectName,
      '--app-type', 'mpa',
      '--style', 'scss',
      '--script', 'js',
      '--no-install'
    ],
    {cwd}
  );

  assert.ok(
    fs.existsSync(projectPath),
    'Project directory was not created'
  );

  assert.ok(
    fs.existsSync(path.join(projectPath, 'package.json')),
    'package.json was not created'
  );

  assert.ok(
    fs.existsSync(path.join(projectPath, 'webpack.config.js')),
    'webpack.config.js was not created'
  );

  console.log('✅ basic.test.js passed');
})();
