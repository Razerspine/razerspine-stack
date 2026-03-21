import {describe, it, expect, vi, afterEach, beforeEach, afterAll} from 'vitest';
import * as path from 'path';
import * as fs from 'fs';
import {executeTestBuild} from './helpers';
import {ScriptType, StyleType, AppType} from '../../src/types';

describe('E2E: Webpack Build Matrix', () => {
    const buildMatrix = [
        {appType: 'mpa' as AppType, scripts: 'js' as ScriptType, styles: 'scss' as StyleType, fixtureFolder: 'js-scss'},
        {appType: 'mpa' as AppType, scripts: 'js' as ScriptType, styles: 'less' as StyleType, fixtureFolder: 'js-less'},
        {appType: 'mpa' as AppType, scripts: 'ts' as ScriptType, styles: 'scss' as StyleType, fixtureFolder: 'ts-scss'},
        {appType: 'mpa' as AppType, scripts: 'ts' as ScriptType, styles: 'less' as StyleType, fixtureFolder: 'ts-less'},
        {appType: 'spa' as AppType, scripts: 'js' as ScriptType, styles: 'scss' as StyleType, fixtureFolder: 'js-scss'},
        {appType: 'spa' as AppType, scripts: 'js' as ScriptType, styles: 'less' as StyleType, fixtureFolder: 'js-less'},
        {appType: 'spa' as AppType, scripts: 'ts' as ScriptType, styles: 'scss' as StyleType, fixtureFolder: 'ts-scss'},
        {appType: 'spa' as AppType, scripts: 'ts' as ScriptType, styles: 'less' as StyleType, fixtureFolder: 'ts-less'},
    ];

    /**
     * Cleans up dist directories for all fixtures in the matrix
     */
    const cleanDist = () => {
        const fixturesPath = path.resolve(__dirname, '../fixtures');

        buildMatrix.forEach(({appType, fixtureFolder}) => {
            const distPath = path.join(fixturesPath, appType, fixtureFolder, 'dist');
            if (fs.existsSync(distPath)) {
                fs.rmSync(distPath, {recursive: true, force: true});
            }
        });

        // Also clean up potential ghost 'src' directories created by failed tests
        const ghostSrc = [path.join(fixturesPath, 'mpa/src'), path.join(fixturesPath, 'spa/src')];
        ghostSrc.forEach(p => {
            if (fs.existsSync(p)) fs.rmSync(p, {recursive: true, force: true});
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

    // --- 1. CORE MATRIX TESTS ---
    it.each(buildMatrix)(
        'should successfully build $appType project ($scripts + $styles) in production mode',
        async ({appType, scripts, styles, fixtureFolder}) => {

            // Template entry path: fixtures/{type}/{folder}/src/views/pages
            const entryPath = appType === 'mpa'
                ? path.resolve(__dirname, `../fixtures/${appType}/${fixtureFolder}/src/views/pages`)
                : path.resolve(__dirname, `../fixtures/${appType}/${fixtureFolder}/src/views/pages/index.pug`);

            const {outDir} = await executeTestBuild(`${appType}/${fixtureFolder}`, {
                mode: 'production',
                scripts,
                styles,
                appType,
                templates: {
                    entry: entryPath
                }
            });

            expect(hasFileWithExtension(outDir, '.css')).toBe(true);
            expect(hasFileWithExtension(outDir, '.js')).toBe(true);
            expect(fs.existsSync(path.join(outDir, 'index.html'))).toBe(true);

            if (appType === 'mpa') {
                const html = fs.readFileSync(path.join(outDir, 'index.html'), 'utf-8');
                expect(html).toContain('<!DOCTYPE html>');
                // Check if multiple pages are generated
                expect(fs.existsSync(path.join(outDir, 'about.html'))).toBe(true);
            } else {
                expect(fs.existsSync(path.join(outDir, '404.html'))).toBe(true);
            }
        }
    );

    // --- 2. DEVELOPMENT MODE TEST ---
    it('should successfully build in development mode', async () => {
        const fixtureRelPath = 'spa/ts-scss';
        const entryPath = path.resolve(__dirname, `../fixtures/${fixtureRelPath}/src/views/pages/index.pug`);

        const {outDir} = await executeTestBuild(fixtureRelPath, {
            mode: 'development',
            scripts: 'ts',
            styles: 'scss',
            appType: 'spa',
            templates: {
                entry: entryPath
            }
        });

        expect(fs.existsSync(path.join(outDir, 'index.html'))).toBe(true);
        expect(hasFileWithExtension(outDir, '.js')).toBe(true);
    });

    // --- 3. HOSTING / VERCEL TESTS ---
    it('should generate vercel.json for MPA', async () => {
        vi.stubEnv('VERCEL', '1');
        const fixtureRelPath = 'mpa/js-scss';

        const {outDir} = await executeTestBuild(fixtureRelPath, {
            mode: 'production',
            scripts: 'js',
            styles: 'scss',
            appType: 'mpa',
            templates: {
                entry: path.resolve(__dirname, `../fixtures/${fixtureRelPath}/src/views/pages`)
            }
        });

        expect(fs.existsSync(path.join(outDir, 'vercel.json'))).toBe(true);
    });

    it('should generate vercel.json with rewrites for SPA', async () => {
        vi.stubEnv('VERCEL', '1');
        const fixtureRelPath = 'spa/ts-less';

        const {outDir} = await executeTestBuild(fixtureRelPath, {
            mode: 'production',
            scripts: 'ts',
            styles: 'less',
            appType: 'spa',
            templates: {
                entry: path.resolve(__dirname, `../fixtures/${fixtureRelPath}/src/views/pages/index.pug`)
            }
        });

        const vercelJson = JSON.parse(fs.readFileSync(path.join(outDir, 'vercel.json'), 'utf-8'));
        // Check for modern Vercel SPA rewrite rule
        expect(vercelJson.rewrites).toBeDefined();
        expect(vercelJson.rewrites[0].destination).toBe('/index.html');
    });

    // --- 4. VALIDATION TESTS ---
    it('should throw if templates entry is missing for MPA', async () => {
        await expect(
            executeTestBuild('mpa/js-scss', {
                mode: 'production',
                scripts: 'js',
                styles: 'scss',
                appType: 'mpa'
            })
        ).rejects.toThrow('[build] templates.entry is required for MPA');
    });

    it('should fail if template path does not exist', async () => {
        await expect(
            executeTestBuild('spa/ts-scss', {
                mode: 'production',
                scripts: 'ts',
                styles: 'scss',
                appType: 'spa',
                templates: {
                    entry: 'non/existent/path.pug'
                }
            })
        ).rejects.toThrow();
    });
});
