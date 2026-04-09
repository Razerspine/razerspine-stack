import {describe, it, expect, beforeEach, afterEach} from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {writeGitignore} from '../../../src/utils';
import {createTempDir} from '../../helpers/temp-dir';
import {cleanupDirectory} from '../../helpers/cleanup-directory';

describe('writeGitignore (Unit)', () => {
    let targetDir: string;

    beforeEach(() => {
        targetDir = createTempDir();
    });

    afterEach(() => {
        cleanupDirectory(targetDir);
    });

    it('should create a .gitignore file in the target directory', async () => {
        await writeGitignore(targetDir);

        expect(fs.existsSync(path.join(targetDir, '.gitignore'))).toBe(true);
    });

    it('should include node_modules in .gitignore', async () => {
        await writeGitignore(targetDir);

        const content = fs.readFileSync(path.join(targetDir, '.gitignore'), 'utf-8');
        expect(content).toContain('node_modules/');
    });

    it('should include dist in .gitignore', async () => {
        await writeGitignore(targetDir);

        const content = fs.readFileSync(path.join(targetDir, '.gitignore'), 'utf-8');
        expect(content).toContain('dist/');
    });

    it('should include .env in .gitignore', async () => {
        await writeGitignore(targetDir);

        const content = fs.readFileSync(path.join(targetDir, '.gitignore'), 'utf-8');
        expect(content).toContain('.env');
    });
});
