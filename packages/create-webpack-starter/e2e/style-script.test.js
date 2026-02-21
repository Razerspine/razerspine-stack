import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

import { runCLI } from './helpers/run-cli.js';
import { createTempDir } from './helpers/temp-dir.js';

(async () => {
  const cwd = createTempDir();
  const projectName = 'test-style-script-app';
  const projectPath = path.join(cwd, projectName);

  await runCLI(
    [
      projectName,
      '--app-type', 'mpa',
      '--style', 'scss',
      '--script', 'ts',
      '--no-install'
    ],
    { cwd }
  );

  assert.ok(
    fs.existsSync(projectPath),
    'Project directory was not created'
  );

  // SCSS
  const stylesDir = path.join(projectPath, 'src/assets/styles');
  const styles = fs.readdirSync(stylesDir);
  assert.ok(
    styles.some(f => f.endsWith('.scss')),
    'SCSS files not found'
  );

  // TypeScript
  assert.ok(
    fs.existsSync(path.join(projectPath, 'tsconfig.json')),
    'tsconfig.json not found'
  );

  console.log('✅ style-script.test.js passed');
})();
