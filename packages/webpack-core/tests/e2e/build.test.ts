import {describe, it, expect, vi, afterEach, beforeEach, afterAll} from 'vitest';
import * as path from 'path';
import * as fs from 'fs';
import {executeTestBuild} from './helpers';

describe('E2E: Webpack Build', () => {
    const fixtures = ['mpa', 'spa'];

    const cleanDist = () => {
        fixtures.forEach(type => {
            const distPath = path.resolve(__dirname, `../fixtures/${type}/dist`);
            if (fs.existsSync(distPath)) {
                fs.rmSync(distPath, {recursive: true, force: true});
            }
        });
    };

    beforeEach(() => {
        cleanDist();
        vi.unstubAllEnvs();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    afterAll(() => {
        cleanDist();
    });

    const hasFileWithExtension = (dir: string, ext: string): boolean => {
        if (!fs.existsSync(dir)) return false;
        const files = fs.readdirSync(dir, {recursive: true}) as string[];
        return files.some(f => f.endsWith(ext));
    };

    it('should successfully build MPA project (JS + SCSS)', async () => {
        const {outDir} = await executeTestBuild('mpa', {
            mode: 'production',
            scripts: 'js',
            styles: 'scss',
            appType: 'mpa',
            templates: {entry: path.resolve(__dirname, '../fixtures/mpa/src/views/pages')}
        });

        expect(fs.existsSync(path.join(outDir, 'index.html'))).toBe(true);
        expect(hasFileWithExtension(outDir, '.css')).toBe(true);
        expect(hasFileWithExtension(outDir, '.js')).toBe(true);
    });

    it('should generate vercel.json when Vercel is detected for MPA', async () => {
        vi.stubEnv('VERCEL', '1');

        const {outDir} = await executeTestBuild('mpa', {
            mode: 'production',
            scripts: 'js',
            styles: 'scss',
            appType: 'mpa',
            templates: {entry: path.resolve(__dirname, '../fixtures/mpa/src/views/pages')}
        });

        expect(fs.existsSync(path.join(outDir, 'vercel.json'))).toBe(true);
    });

    it('should successfully build SPA project (TS + SCSS) and create 404.html', async () => {
        const {outDir} = await executeTestBuild('spa', {
            mode: 'production',
            scripts: 'ts',
            styles: 'scss',
            appType: 'spa',
            templates: {entry: path.resolve(__dirname, '../fixtures/spa/src/views/pages/index.pug')}
        });

        expect(fs.existsSync(path.join(outDir, 'index.html'))).toBe(true);
        expect(fs.existsSync(path.join(outDir, '404.html'))).toBe(true);
    });
});
