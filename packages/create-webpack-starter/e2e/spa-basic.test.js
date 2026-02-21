// packages/create-webpack-starter/e2e/spa-basic.test.js
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

import {runCLI} from './helpers/run-cli.js';
import {createTempDir} from './helpers/temp-dir.js';

(async () => {
  const cwd = createTempDir();
  const projectName = 'test-spa-app';
  const projectPath = path.join(cwd, projectName);

  console.log('Testing SPA template generation...');

  await runCLI(
    [
      projectName,
      '--app-type', 'spa',
      '--style', 'scss',
      '--script', 'ts',
      '--no-install'
    ],
    {cwd}
  );

  assert.ok(fs.existsSync(projectPath), 'Project directory was not created');
  assert.ok(fs.existsSync(path.join(projectPath, 'package.json')), 'package.json missing');
  assert.ok(fs.existsSync(path.join(projectPath, 'tsconfig.json')), 'tsconfig.json missing (required for TS)');
  assert.ok(fs.existsSync(path.join(projectPath, 'src/assets/scripts/app.ts')), 'Entry script missing');

  console.log('✅ spa-basic.test.js passed');
})();
