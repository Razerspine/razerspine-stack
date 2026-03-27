import {describe, it, expect, beforeEach, afterEach} from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {detectPackageManager} from '../../../src/utils/installer';
import {createTempDir} from '../../helpers/temp-dir';
import {cleanupDirectory} from '../../helpers/cleanup-directory';

describe('detectPackageManager (Unit)', () => {
    let tempDir: string;

    beforeEach(() => {
        tempDir = createTempDir();
    });

    afterEach(() => {
        cleanupDirectory(tempDir);
    });

    it('should return "pnpm" if pnpm-lock.yaml exists', () => {
        fs.writeFileSync(path.join(tempDir, 'pnpm-lock.yaml'), '');
        expect(detectPackageManager(tempDir)).toBe('pnpm');
    });

    it('should return "yarn" if yarn.lock exists', () => {
        fs.writeFileSync(path.join(tempDir, 'yarn.lock'), '');
        expect(detectPackageManager(tempDir)).toBe('yarn');
    });

    it('should return "bun" if bun.lockb exists', () => {
        fs.writeFileSync(path.join(tempDir, 'bun.lockb'), '');
        expect(detectPackageManager(tempDir)).toBe('bun');
    });

    it('should return "npm" if package-lock.json exists', () => {
        fs.writeFileSync(path.join(tempDir, 'package-lock.json'), '');
        expect(detectPackageManager(tempDir)).toBe('npm');
    });

    it('should fallback to "npm" if no lock files are found', () => {
        expect(detectPackageManager(tempDir)).toBe('npm');
    });
});
