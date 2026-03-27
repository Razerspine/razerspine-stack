import fs from 'node:fs';
import path from 'node:path';
import {runCLI} from '../helpers/run-cli';
import {createTempDir} from '../helpers/temp-dir';
import {cleanupDirectory} from '../helpers/cleanup-directory';
import {describe, it, expect, beforeEach, afterEach} from 'vitest';

describe('Dry Run Flag', () => {
    let cwd: string;
    let projectPath: string;

    beforeEach(() => {
        cwd = createTempDir();
        const projectName = 'test-dry-run-app';
        projectPath = path.join(cwd, projectName);
    });

    afterEach(() => {
        cleanupDirectory(cwd);
    });

    it('should not create any files when --dry-run is passed', async () => {
        await runCLI(
            ['test-dry-run-app', '--app-type', 'mpa', '--style', 'scss', '--script', 'ts', '--dry-run'],
            {cwd}
        );

        expect(fs.existsSync(projectPath)).toBeFalsy();
    });
});
