import {describe, it, expect, beforeEach, afterEach} from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import {patchPackageJson} from '../../../src/utils';
import {createTempDir} from '../../helpers/temp-dir';
import {cleanupDirectory} from '../../helpers/cleanup-directory';

describe('patchPackageJson (Unit)', () => {
    let tempDir: string;
    let pkgPath: string;

    beforeEach(async () => {
        tempDir = createTempDir();
        pkgPath = path.join(tempDir, 'package.json');

        const initialPkg = {
            name: 'template-name',
            version: '1.0.0',
            scripts: {
                start: 'npm run serve',
                build: 'npm run clean && npm run compile',
                test: 'jest'
            }
        };

        await fs.writeFile(pkgPath, JSON.stringify(initialPkg));
    });

    afterEach(() => {
        cleanupDirectory(tempDir);
    });

    it('should set project name, private flag, and packageManager field', async () => {
        await patchPackageJson(tempDir, 'my-awesome-app', 'yarn');

        const updatedPkg = JSON.parse(await fs.readFile(pkgPath, 'utf-8'));

        expect(updatedPkg.name).toBe('my-awesome-app');
        expect(updatedPkg.private).toBe(true);
        expect(updatedPkg.packageManager).toBe('yarn@latest');
    });

    it('should replace "npm run" prefixes with the correct package manager command', async () => {
        await patchPackageJson(tempDir, 'app', 'pnpm');

        const updatedPkg = JSON.parse(await fs.readFile(pkgPath, 'utf-8'));

        expect(updatedPkg.scripts.start).toBe('pnpm serve');
        expect(updatedPkg.scripts.build).toBe('pnpm clean && pnpm compile');
        expect(updatedPkg.scripts.test).toBe('jest');
    });

    it('should correctly replace scripts for bun', async () => {
        await patchPackageJson(tempDir, 'app', 'bun');

        const updatedPkg = JSON.parse(await fs.readFile(pkgPath, 'utf-8'));

        expect(updatedPkg.scripts.start).toBe('bun run serve');
    });
});
