import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {detectPackageManager} from '../../../src/utils/installer';
import {createTempDir} from '../../helpers/temp-dir';
import {cleanupDirectory} from '../../helpers/cleanup-directory';

describe('detectPackageManager (Unit)', () => {
    let tempDir: string;

    beforeEach(() => {
        tempDir = createTempDir();
        vi.stubEnv('npm_config_user_agent', '');
    });

    afterEach(() => {
        cleanupDirectory(tempDir);
        vi.unstubAllEnvs();
    });

    it('should detect pnpm via user agent', () => {
        vi.stubEnv('npm_config_user_agent', 'pnpm/9.0.0 npm/? node/v20.0.0 linux x64');
        expect(detectPackageManager(tempDir)).toBe('pnpm');
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

    it('should return "bun" if bun.lock exists', () => {
        fs.writeFileSync(path.join(tempDir, 'bun.lock'), '');
        expect(detectPackageManager(tempDir)).toBe('bun');
    });

    it('should return "npm" if package-lock.json exists', () => {
        fs.writeFileSync(path.join(tempDir, 'package-lock.json'), '');
        expect(detectPackageManager(tempDir)).toBe('npm');
    });

    it('should fallback to "npm" if no lock files are found', () => {
        expect(detectPackageManager(tempDir)).toBe('npm');
    });

    describe('packageManager field in package.json', () => {
        it('should detect pnpm from packageManager field', () => {
            fs.writeFileSync(
                path.join(tempDir, 'package.json'),
                JSON.stringify({packageManager: 'pnpm@10.33.0'})
            );
            expect(detectPackageManager(tempDir)).toBe('pnpm');
        });

        it('should detect yarn from packageManager field', () => {
            fs.writeFileSync(
                path.join(tempDir, 'package.json'),
                JSON.stringify({packageManager: 'yarn@4.2.1'})
            );
            expect(detectPackageManager(tempDir)).toBe('yarn');
        });

        it('should detect bun from packageManager field', () => {
            fs.writeFileSync(
                path.join(tempDir, 'package.json'),
                JSON.stringify({packageManager: 'bun@1.2.0'})
            );
            expect(detectPackageManager(tempDir)).toBe('bun');
        });

        it('should detect npm from packageManager field', () => {
            fs.writeFileSync(
                path.join(tempDir, 'package.json'),
                JSON.stringify({packageManager: 'npm@10.2.4'})
            );
            expect(detectPackageManager(tempDir)).toBe('npm');
        });

        it('should fall through to lock files if packageManager field is missing', () => {
            fs.writeFileSync(
                path.join(tempDir, 'package.json'),
                JSON.stringify({name: 'test'})
            );
            fs.writeFileSync(path.join(tempDir, 'yarn.lock'), '');
            expect(detectPackageManager(tempDir)).toBe('yarn');
        });

        it('should fall through to lock files if package.json is malformed', () => {
            fs.writeFileSync(path.join(tempDir, 'package.json'), '{invalid json}');
            fs.writeFileSync(path.join(tempDir, 'pnpm-lock.yaml'), '');
            expect(detectPackageManager(tempDir)).toBe('pnpm');
        });

        it('user agent takes priority over packageManager field', () => {
            vi.stubEnv('npm_config_user_agent', 'pnpm/10.0.0 npm/? node/v20.0.0 linux x64');
            fs.writeFileSync(
                path.join(tempDir, 'package.json'),
                JSON.stringify({packageManager: 'yarn@4.2.1'})
            );
            expect(detectPackageManager(tempDir)).toBe('pnpm');
        });
    });
});
