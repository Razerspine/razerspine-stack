import fs from 'node:fs';
import path from 'node:path';
import {describe, it, expect, beforeAll, afterAll} from 'vitest';
import {runCLI} from '../helpers/run-cli';
import {createTempDir} from '../helpers/temp-dir';

describe('Style and Script Options', () => {
    let cwd: string;
    const projectName = 'test-style-script-app';

    beforeAll(() => {
        cwd = createTempDir();
    });

    afterAll(() => {
        fs.rmSync(cwd, {recursive: true, force: true});
    });

    it('should create a project with SCSS and TypeScript', async () => {
        const projectPath = path.join(cwd, projectName);

        await runCLI(
            [
                projectName,
                '--app-type', 'mpa',
                '--style', 'scss',
                '--script', 'ts',
                '--no-install'
            ],
            {cwd}
        );

        expect(fs.existsSync(projectPath)).toBe(true);

        const stylesDir = path.join(projectPath, 'src/styles');
        const styles = fs.readdirSync(stylesDir);
        expect(styles.some(f => f.endsWith('.scss'))).toBe(true);

        expect(fs.existsSync(path.join(projectPath, 'tsconfig.json'))).toBe(true);
    });
});
