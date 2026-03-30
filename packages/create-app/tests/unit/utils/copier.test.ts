import {describe, it, expect, beforeEach, afterEach} from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {copyTemplate} from '../../../src/utils';
import {createTempDir} from '../../helpers/temp-dir';
import {cleanupDirectory} from '../../helpers/cleanup-directory';

describe('copyTemplate (Unit)', () => {

    let sourceDir: string;
    let targetDir: string;

    beforeEach(() => {
        sourceDir = createTempDir();
        targetDir = path.join(createTempDir(), 'target');

        fs.mkdirSync(path.join(sourceDir, 'src'));
        fs.mkdirSync(path.join(sourceDir, 'node_modules'));
        fs.mkdirSync(path.join(sourceDir, 'dist'));

        fs.writeFileSync(path.join(sourceDir, 'src', 'index.ts'), 'console.log("hello");');
        fs.writeFileSync(path.join(sourceDir, 'package.json'), '{}');
        fs.writeFileSync(path.join(sourceDir, 'package-lock.json'), 'lock');
        fs.writeFileSync(path.join(sourceDir, 'yarn.lock'), 'lock');
        fs.writeFileSync(path.join(sourceDir, 'node_modules', 'lib.js'), 'lib');
        fs.writeFileSync(path.join(sourceDir, 'dist', 'bundle.js'), 'bundle');
    });

    afterEach(() => {
        cleanupDirectory(sourceDir);
        cleanupDirectory(path.dirname(targetDir));
    });

    it('should copy allowed files and ignore node_modules, dist, and lock files', async () => {
        await copyTemplate(sourceDir, targetDir);

        expect(fs.existsSync(targetDir)).toBe(true);
        expect(fs.existsSync(path.join(targetDir, 'src', 'index.ts'))).toBe(true);
        expect(fs.existsSync(path.join(targetDir, 'package.json'))).toBe(true);

        expect(fs.existsSync(path.join(targetDir, 'node_modules'))).toBe(false);
        expect(fs.existsSync(path.join(targetDir, 'dist'))).toBe(false);
        expect(fs.existsSync(path.join(targetDir, 'package-lock.json'))).toBe(false);
        expect(fs.existsSync(path.join(targetDir, 'yarn.lock'))).toBe(false);
    });
});
