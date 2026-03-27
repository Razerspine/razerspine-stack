import fs from 'node:fs';
import path from 'node:path';
import {runCLI} from '../helpers/run-cli';
import {createTempDir} from '../helpers/temp-dir';
import {cleanupDirectory} from '../helpers/cleanup-directory';
import {describe, it, expect, beforeEach, afterEach} from 'vitest';

describe('Basic Template Generation', () => {
    let cwd: string;
    let projectPath: string;

    beforeEach(() => {
        cwd = createTempDir();
        const projectName = 'test-basic-app';
        projectPath = path.join(cwd, projectName);
    });

    afterEach(() => {
        cleanupDirectory(cwd);
    });

    it('should create an MPA project with default settings', async () => {
        await runCLI(
            [
                'test-basic-app',
                '--app-type', 'mpa',
                '--style', 'scss',
                '--script', 'js',
                '--no-install'
            ],
            {cwd}
        );

        expect(fs.existsSync(projectPath)).toBeTruthy();
        expect(fs.existsSync(path.join(projectPath, 'package.json'))).toBeTruthy();
        expect(fs.existsSync(path.join(projectPath, 'webpack.config.js'))).toBeTruthy();
    });
});
