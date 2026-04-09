import {describe, it, expect, vi, beforeEach} from 'vitest';
import {createPugTemplatesPlugin} from '../../../src/plugins/pug-templates-plugin';
import * as fs from 'node:fs';

vi.mock('node:fs');

describe('createPugTemplatesPlugin', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(fs.existsSync).mockReturnValue(true);
    });

    describe('MPA filename smart routing', () => {
        beforeEach(() => {
            vi.mocked(fs.statSync).mockReturnValue({
                isFile: () => false,
                isDirectory: () => true
            } as any);
        });

        function getFilenameFunction() {
            const plugin = createPugTemplatesPlugin({
                entry: 'pages',
                mode: 'development',
                appType: 'mpa'
            });
            const config: any = {};
            plugin.applyBase!(config);
            const pugPlugin = config.plugins[0] as any;
            const opts = pugPlugin.options || pugPlugin.option?.options;
            return opts.filename as (pathData: any) => string;
        }

        it('maps bare home chunk to index.html', () => {
            const filename = getFilenameFunction();
            expect(filename({chunk: {name: 'home'}})).toBe('index.html');
        });

        it('maps nested home/home chunk to index.html', () => {
            const filename = getFilenameFunction();
            expect(filename({chunk: {name: 'home/home'}})).toBe('index.html');
        });

        it('maps bare 404 chunk to 404.html', () => {
            const filename = getFilenameFunction();
            expect(filename({chunk: {name: '404'}})).toBe('404.html');
        });

        it('maps nested 404/404 chunk to 404.html', () => {
            const filename = getFilenameFunction();
            expect(filename({chunk: {name: '404/404'}})).toBe('404.html');
        });

        it('flattens redundant dir/name pair (e.g. build/build) to build.html', () => {
            const filename = getFilenameFunction();
            expect(filename({chunk: {name: 'build/build'}})).toBe('build.html');
        });

        it('preserves non-redundant nested paths', () => {
            const filename = getFilenameFunction();
            expect(filename({chunk: {name: 'about/index'}})).toBe('about/index.html');
        });

        it('preserves simple non-special names', () => {
            const filename = getFilenameFunction();
            expect(filename({chunk: {name: 'contact'}})).toBe('contact.html');
        });
    });

    it('should throw if SPA entry is not a file', () => {
        vi.mocked(fs.statSync).mockReturnValue({
            isFile: () => false,
            isDirectory: () => true
        } as any);

        expect(() => createPugTemplatesPlugin({
            entry: 'test.pug',
            mode: 'development',
            appType: 'spa'
        })).toThrow('SPA requires a single pug file');
    });

    it('should pass object data directly to pug-plugin options', () => {
        vi.mocked(fs.statSync).mockReturnValue({
            isFile: () => true,
            isDirectory: () => false
        } as any);

        const plugin = createPugTemplatesPlugin({
            entry: 'test.pug',
            mode: 'development',
            appType: 'spa',
            data: {siteName: 'Pug App'}
        });

        const config: any = {};
        plugin.applyBase!(config);

        const pugPlugin = config.plugins[0] as any;
        const capturedOptions = pugPlugin.options || pugPlugin.option?.options;

        expect(config.plugins.length).toBe(1);
        expect(capturedOptions.data).toEqual({siteName: 'Pug App'});
    });

    it('should pass string path data directly to pug-plugin options', () => {
        vi.mocked(fs.statSync).mockReturnValue({
            isFile: () => true,
            isDirectory: () => false
        } as any);

        const plugin = createPugTemplatesPlugin({
            entry: 'test.pug',
            mode: 'development',
            appType: 'spa',
            data: './src/data/site.json'
        });

        const config: any = {};
        plugin.applyBase!(config);

        const pugPlugin = config.plugins[0] as any;
        const capturedOptions = pugPlugin.options || pugPlugin.option?.options;

        expect(capturedOptions.data).toBe('./src/data/site.json');
    });
});
