import {describe, it, expect, vi, beforeEach} from 'vitest';
import {createPugTemplatesPlugin} from '../../../src/plugins/pug-templates-plugin';
import * as fs from 'node:fs';

vi.mock('node:fs');

describe('createPugTemplatesPlugin', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(fs.existsSync).mockReturnValue(true);
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
