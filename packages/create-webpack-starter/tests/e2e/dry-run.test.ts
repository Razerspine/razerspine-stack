import fs from 'node:fs';
import path from 'node:path';
import {runCLI} from '../helpers/run-cli';
import {createTempDir} from '../helpers/temp-dir';

describe('Dry Run Flag', () => {
    let cwd: string;
    let projectPath: string;

    beforeAll(() => {
        cwd = createTempDir();
        const projectName = 'test-dry-run-app';
        projectPath = path.join(cwd, projectName);
    });

    afterAll(() => {
        fs.rmSync(cwd, {recursive: true, force: true});
    });

    it('should not create any files when --dry-run is passed', async () => {
        await runCLI(
            ['test-dry-run-app', '--app-type', 'mpa', '--style', 'scss', '--script', 'ts', '--dry-run'],
            {cwd}
        );

        expect(fs.existsSync(projectPath)).toBeFalsy();
    });
});
