import {describe, it, expect, vi, beforeEach} from 'vitest';
import * as fs from 'node:fs';
import {createHtmlTemplatesPlugin} from '../../../src/plugins/html-templates-plugin';

vi.mock('node:fs');

describe('createHtmlTemplatesPlugin', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should throw if entry does not exist', () => {
        vi.mocked(fs.existsSync).mockReturnValue(false);

        expect(() => {
            createHtmlTemplatesPlugin({
                entry: 'invalid',
                scriptEntry: 'src/app/main.ts',
                mode: 'development',
                appType: 'spa'
            });
        }).toThrow('[build] HTML templates entry not found');
    });

    it('should throw if SPA entry is not a file', () => {
        vi.mocked(fs.existsSync).mockReturnValue(true);
        vi.mocked(fs.statSync).mockReturnValue({
            isFile: () => false
        } as any);

        expect(() => {
            createHtmlTemplatesPlugin({
                entry: 'dir',
                scriptEntry: 'src/app/main.ts',
                mode: 'development',
                appType: 'spa'
            });
        }).toThrow('SPA requires a single HTML file');
    });

    it('should throw if MPA entry is not a directory', () => {
        vi.mocked(fs.existsSync).mockReturnValue(true);
        vi.mocked(fs.statSync).mockReturnValue({
            isDirectory: () => false
        } as any);

        expect(() => {
            createHtmlTemplatesPlugin({
                entry: 'file.html',
                scriptEntry: 'src/app/main.ts',
                mode: 'development',
                appType: 'mpa'
            });
        }).toThrow('MPA requires templates.entry to be a directory');
    });

    it('should apply HtmlWebpackPlugin for SPA and inject scriptEntry', () => {
        vi.mocked(fs.existsSync).mockReturnValue(true);
        vi.mocked(fs.statSync).mockReturnValue({
            isFile: () => true
        } as any);

        const plugin = createHtmlTemplatesPlugin({
            entry: 'index.html',
            scriptEntry: 'src/app/main.ts',
            mode: 'development',
            appType: 'spa'
        });

        const config: any = {};
        plugin.applyBase!(config);

        expect(config.entry.main.import).toEqual(['src/app/main.ts']);

        expect(config.plugins.length).toBe(1);
        expect(config.plugins[0].constructor.name).toBe('HtmlWebpackPlugin');
    });

    it('should apply HtmlWebpackPlugin for each HTML file in MPA', () => {
        vi.mocked(fs.existsSync).mockReturnValue(true);
        vi.mocked(fs.statSync).mockReturnValue({
            isDirectory: () => true
        } as any);

        vi.mocked(fs.readdirSync).mockReturnValue([
            'index.html',
            'about.html',
            'ignore.txt'
        ] as any);

        const plugin = createHtmlTemplatesPlugin({
            entry: 'pages',
            scriptEntry: 'src/app/main.ts',
            mode: 'development',
            appType: 'mpa'
        });

        const config: any = {};
        plugin.applyBase!(config);

        expect(config.entry.main.import).toEqual(['src/app/main.ts']);

        expect(config.plugins.length).toBe(2);
        expect(config.plugins[0].constructor.name).toBe('HtmlWebpackPlugin');
        expect(config.plugins[1].constructor.name).toBe('HtmlWebpackPlugin');
    });

    it('should pass data via templateParameters function and merge correctly', () => {
        vi.mocked(fs.existsSync).mockReturnValue(true);
        vi.mocked(fs.statSync).mockReturnValue({
            isFile: () => true
        } as any);

        const plugin = createHtmlTemplatesPlugin({
            entry: 'index.html',
            scriptEntry: 'src/app/main.ts',
            mode: 'development',
            appType: 'spa',
            data: {
                siteName: 'My App',
                version: '1.0.0'
            }
        });

        const config: any = {};
        plugin.applyBase!(config);

        const htmlPlugin = config.plugins[0] as any;
        const pluginOptions = htmlPlugin.userOptions || htmlPlugin.options;

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
    });
});
