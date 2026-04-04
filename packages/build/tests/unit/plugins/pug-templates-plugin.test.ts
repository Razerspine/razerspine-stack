import {describe, it, expect, vi, beforeEach} from 'vitest';
import {PugTemplatesPlugin} from '../../../src/plugins/pug-templates-plugin';
import * as fs from 'node:fs';

vi.mock('node:fs');

describe('PugTemplatesPlugin', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(fs.existsSync).mockReturnValue(true);
    });

    it('should throw if SPA entry is not a file', () => {
        vi.mocked(fs.statSync).mockReturnValue({
            isFile: () => false,
            isDirectory: () => true
        } as any);

        expect(() => new PugTemplatesPlugin({
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

        let capturedOptions: any;

        const PugPlugin = require('pug-plugin');
        const spy = vi.spyOn(PugPlugin.prototype, 'apply')
            .mockImplementation(function (this: any) {
                capturedOptions = this.option?.options || this.options;
            });

        const plugin = new PugTemplatesPlugin({
            entry: 'test.pug',
            mode: 'development',
            appType: 'spa',
            data: {siteName: 'Pug App'}
        });

        plugin.apply({
            hooks: {}
        } as any);

        expect(spy).toHaveBeenCalled();
        expect(capturedOptions.data).toEqual({siteName: 'Pug App'});

        spy.mockRestore();
    });

    it('should pass string path data directly to pug-plugin options', () => {
        vi.mocked(fs.statSync).mockReturnValue({
            isFile: () => true,
            isDirectory: () => false
        } as any);

        let capturedOptions: any;
        const PugPlugin = require('pug-plugin');
        const spy = vi.spyOn(PugPlugin.prototype, 'apply')
            .mockImplementation(function (this: any) {
                capturedOptions = this.option?.options || this.options;
            });

        const plugin = new PugTemplatesPlugin({
            entry: 'test.pug',
            mode: 'development',
            appType: 'spa',
            data: './src/data/site.json'
        });

        plugin.apply({
            hooks: {}
        } as any);

        expect(spy).toHaveBeenCalled();
        expect(capturedOptions.data).toBe('./src/data/site.json');

        spy.mockRestore();
    });
});
