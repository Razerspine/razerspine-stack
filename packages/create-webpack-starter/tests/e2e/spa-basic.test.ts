import fs from 'node:fs';
import path from 'node:path';
import {runCLI} from '../helpers/run-cli';
import {createTempDir} from '../helpers/temp-dir';

describe('SPA Template Generation', () => {
    let cwd: string;
    let projectPath: string;

    beforeAll(() => {
        cwd = createTempDir();
        projectPath = path.join(cwd, 'test-spa-app');
    });

    afterAll(() => {
        if (fs.existsSync(cwd)) {
            fs.rmSync(cwd, {recursive: true, force: true});
        }
    });

    it('should create an SPA project with TypeScript configuration', async () => {
        await runCLI(
            [
                'test-spa-app',
                '--app-type', 'spa',
                '--style', 'scss',
                '--script', 'ts',
                '--no-install'
            ],
            {cwd}
        );

        const checkFile = (relativePath: string) => {
            const fullPath = path.join(projectPath, relativePath);
            const exists = fs.existsSync(fullPath);
            if (!exists) {
                console.log(`❌ Missing file: ${relativePath}`);
                if (fs.existsSync(path.join(projectPath, 'src'))) {
                    console.log('Files in src:', fs.readdirSync(path.join(projectPath, 'src'), {recursive: true}));
                }
            }
            return exists;
        };

        expect(fs.existsSync(projectPath)).toBe(true);
        expect(checkFile('package.json')).toBe(true);
        expect(checkFile('tsconfig.json')).toBe(true);

        expect(checkFile('src/app/app.ts')).toBe(true);
        expect(checkFile('src/app/app.pug')).toBe(true);
    });
});
