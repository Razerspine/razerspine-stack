import {describe, it, expect, vi, beforeEach} from 'vitest';
import * as fs from 'node:fs';
import {HtmlTemplatesPlugin} from '../../../src/plugins/html-templates-plugin';

vi.mock('node:fs');

describe('HtmlTemplatesPlugin', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should throw if entry does not exist', () => {
        (fs.existsSync as any).mockReturnValue(false);

        expect(() => {
            new HtmlTemplatesPlugin({
                entry: 'invalid',
                mode: 'development',
                appType: 'spa'
            });
        }).toThrow('[build] HTML templates entry not found');
    });

    it('should throw if SPA entry is not a file', () => {
        (fs.existsSync as any).mockReturnValue(true);
        (fs.statSync as any).mockReturnValue({
            isFile: () => false
        });

        expect(() => {
            new HtmlTemplatesPlugin({
                entry: 'dir',
                mode: 'development',
                appType: 'spa'
            });
        }).toThrow('SPA requires a single HTML file');
    });

    it('should throw if MPA entry is not a directory', () => {
        (fs.existsSync as any).mockReturnValue(true);
        (fs.statSync as any).mockReturnValue({
            isDirectory: () => false
        });

        expect(() => {
            new HtmlTemplatesPlugin({
                entry: 'file.html',
                mode: 'development',
                appType: 'mpa'
            });
        }).toThrow('MPA requires templates.entry to be a directory');
    });

    it('should apply HtmlWebpackPlugin for SPA', () => {
        (fs.existsSync as any).mockReturnValue(true);
        (fs.statSync as any).mockReturnValue({
            isFile: () => true
        });

        const applyMock = vi.fn();

        const compiler: any = {
            hooks: {}
        };

        const plugin = new HtmlTemplatesPlugin({
            entry: 'index.html',
            mode: 'development',
            appType: 'spa'
        });

        const spy = vi.spyOn(require('html-webpack-plugin').prototype, 'apply')
            .mockImplementation(applyMock);

        plugin.apply(compiler);

        expect(spy).toHaveBeenCalled();

        spy.mockRestore();
    });

    it('should apply HtmlWebpackPlugin for each HTML file in MPA', () => {
        (fs.existsSync as any).mockReturnValue(true);
        (fs.statSync as any).mockReturnValue({
            isDirectory: () => true
        });

        (fs.readdirSync as any).mockReturnValue([
            'index.html',
            'about.html',
            'ignore.txt'
        ]);

        const applyMock = vi.fn();

        const compiler: any = {
            hooks: {}
        };

        const spy = vi.spyOn(require('html-webpack-plugin').prototype, 'apply')
            .mockImplementation(applyMock);

        const plugin = new HtmlTemplatesPlugin({
            entry: 'pages',
            mode: 'development',
            appType: 'mpa'
        });

        plugin.apply(compiler);

        expect(applyMock).toHaveBeenCalledTimes(2);

        spy.mockRestore();
    });

    it('should pass data via templateParameters function and merge correctly', () => {
        (fs.existsSync as any).mockReturnValue(true);
        (fs.statSync as any).mockReturnValue({
            isFile: () => true
        });

        let pluginOptions: any;

        const spy = vi.spyOn(require('html-webpack-plugin').prototype, 'apply')
            .mockImplementation(function (this: any) {
                pluginOptions = this.userOptions || this.options;
            });

        const plugin = new HtmlTemplatesPlugin({
            entry: 'index.html',
            mode: 'development',
            appType: 'spa',
            data: {
                siteName: 'My App',
                version: '1.0.0'
            }
        });

        const compiler: any = {
            hooks: {}
        };
        plugin.apply(compiler);

        expect(spy).toHaveBeenCalled();

        expect(pluginOptions.templateParameters).toBeTypeOf('function');

        const mockCompilation = {
            options: 'mockWebpackConfig'
        };
        const result = pluginOptions.templateParameters(mockCompilation, 'mockAssets', 'mockTags', 'mockOptions');

        expect(result).toEqual({
            compilation: mockCompilation,
            webpackConfig: 'mockWebpackConfig',
            htmlWebpackPlugin: {
                tags: 'mockTags',
                files: 'mockAssets',
                options: 'mockOptions',
            },
            siteName: 'My App',
            version: '1.0.0'
        });

        spy.mockRestore();
    });
});
