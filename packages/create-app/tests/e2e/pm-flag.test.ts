import fs from 'node:fs';
import path from 'node:path';
import {runCLI} from '../helpers/run-cli';
import {createTempDir} from '../helpers/temp-dir';
import {cleanupDirectory} from '../helpers/cleanup-directory';
import {describe, it, expect, beforeEach, afterEach} from 'vitest';

describe('Package Manager Flag (--pm)', () => {
    let cwd: string;
    let projectPath: string;

    beforeEach(() => {
        cwd = createTempDir();
        const projectName = 'test-pm-app';
        projectPath = path.join(cwd, projectName);
    });

    afterEach(() => {
        cleanupDirectory(cwd);
    });

    it('should adapt package.json scripts for pnpm', async () => {
        await runCLI(
            [
                'test-pm-app',
                '--app-type', 'mpa',
                '--style', 'scss',
                '--script', 'ts',
                '--pm', 'pnpm',
                '--no-install'
            ],
            {cwd}
        );

        const pkgPath = path.join(projectPath, 'package.json');

        expect(fs.existsSync(pkgPath)).toBeTruthy();

        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

        expect(pkg.name).toBe('test-pm-app');

        if (pkg.scripts) {
            const scripts = Object.values(pkg.scripts).join(' ');

            expect(scripts.includes('npm run')).toBeFalsy();

            if (scripts.length > 0) {
                expect(scripts.includes('pnpm')).toBeTruthy();
            }
        }
    });

    it('should adapt package.json scripts for yarn', async () => {
        await runCLI(
            [
                'test-pm-app',
                '--app-type', 'mpa',
                '--style', 'scss',
                '--script', 'ts',
                '--pm', 'yarn',
                '--no-install'
            ],
            {cwd}
        );

        const pkg = JSON.parse(
            fs.readFileSync(path.join(projectPath, 'package.json'), 'utf-8')
        );

        const scripts = Object.values(pkg.scripts || {}).join(' ');

        expect(scripts.includes('npm run')).toBeFalsy();

        if (scripts.length > 0) {
            expect(scripts.includes('yarn')).toBeTruthy();
        }
    });

    it('should fallback to npm if no --pm provided', async () => {
        await runCLI(
            [
                'test-pm-app',
                '--app-type', 'mpa',
                '--style', 'scss',
                '--script', 'ts',
                '--no-install'
            ],
            {cwd}
        );

        const pkg = JSON.parse(
            fs.readFileSync(path.join(projectPath, 'package.json'), 'utf-8')
        );

        const scripts = Object.values(pkg.scripts || {}).join(' ');

        if (scripts.length > 0) {
            expect(scripts.includes('npm run')).toBeTruthy();
        }
    });

    it('should adapt package.json scripts for bun', async () => {
        await runCLI(
            [
                'test-pm-app',
                '--app-type', 'mpa',
                '--style', 'scss',
                '--script', 'ts',
                '--pm', 'bun',
                '--no-install'
            ],
            {cwd}
        );

        const pkg = JSON.parse(
            fs.readFileSync(path.join(projectPath, 'package.json'), 'utf-8')
        );

        const scripts = Object.values(pkg.scripts || {}).join(' ');

        expect(scripts.includes('npm run')).toBeFalsy();

        if (scripts.length > 0) {
            expect(scripts.includes('bun')).toBeTruthy();
        }
    });

    it('should correctly use npm when explicitly provided', async () => {
        await runCLI(
            [
                'test-pm-app',
                '--app-type', 'mpa',
                '--style', 'scss',
                '--script', 'ts',
                '--pm', 'npm',
                '--no-install'
            ],
            {cwd}
        );

        const pkg = JSON.parse(
            fs.readFileSync(path.join(projectPath, 'package.json'), 'utf-8')
        );

        const scripts = Object.values(pkg.scripts || {}).join(' ');

        if (scripts.length > 0) {
            expect(scripts.includes('npm run')).toBeTruthy();
        }
    });

    it('should adapt scripts correctly for different template configurations (spa, less, js)', async () => {
        await runCLI(
            [
                'test-pm-app',
                '--app-type', 'spa',
                '--style', 'less',
                '--script', 'js',
                '--pm', 'pnpm',
                '--no-install'
            ],
            {cwd}
        );

        const pkg = JSON.parse(
            fs.readFileSync(path.join(projectPath, 'package.json'), 'utf-8')
        );

        const scripts = Object.values(pkg.scripts || {}).join(' ');

        expect(scripts.includes('npm run')).toBeFalsy();

        if (scripts.length > 0) {
            expect(scripts.includes('pnpm')).toBeTruthy();
        }
    });

    it('should handle invalid package manager flag gracefully', async () => {
        const runInvalidPm = runCLI(
            [
                'test-pm-app',
                '--app-type', 'mpa',
                '--style', 'scss',
                '--script', 'ts',
                '--pm', 'invalid-pm-name',
                '--no-install'
            ],
            {cwd}
        );

        await expect(runInvalidPm).rejects.toThrow();
    });
});
