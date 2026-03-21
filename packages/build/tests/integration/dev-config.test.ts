import {describe, it, expect, vi} from 'vitest';
import {createBaseConfig, createDevConfig} from '../../src';
import {PugTemplatesPlugin} from '../../src/plugins/pug-templates-plugin';

vi.mock('node:fs', () => ({
    default: {
        existsSync: () => true,
        statSync: () => ({isFile: () => true, isDirectory: () => true})
    },
    existsSync: () => true,
    statSync: () => ({isFile: () => true, isDirectory: () => true}),
}));

describe('createDevConfig', () => {

    it('should set historyApiFallback for SPA correctly', () => {
        const base = createBaseConfig({
            mode: 'development',
            scripts: 'ts',
            styles: 'scss',
            appType: 'spa'
        });

        const devConfig = createDevConfig(base);

        const rewrites = (devConfig.devServer?.historyApiFallback as any).rewrites;
        expect(rewrites[0].to).toBe('/index.html');
    });

    it('should set historyApiFallback for MPA correctly', () => {
        const base = createBaseConfig({
            mode: 'development',
            scripts: 'ts',
            styles: 'scss',
            appType: 'mpa',
            templates: {
                entry: 'src/views/pages'
            }
        });

        const devConfig = createDevConfig(base);

        const rewrites = (devConfig.devServer?.historyApiFallback as any).rewrites;
        expect(rewrites[0].to).toBe('/404.html');
    });

    it('should merge user devServer options', () => {
        const base = createBaseConfig({
            mode: 'development',
            scripts: 'ts',
            styles: 'scss',
            templates: {
                entry: 'src/views/pages'
            }
        });

        const devConfig = createDevConfig(base, {port: 3000});
        expect(devConfig.devServer?.port).toBe(3000);
        expect(devConfig.devtool).toBe('source-map');
    });

    it('should not override custom historyApiFallback', () => {
        const base = createBaseConfig({
            mode: 'development',
            scripts: 'ts',
            styles: 'scss',
            appType: 'spa'
        });

        const devConfig = createDevConfig(base, {
            historyApiFallback: {
                rewrites: [{from: /./, to: '/custom.html'}]
            }
        });

        const rewrites = (devConfig.devServer?.historyApiFallback as any).rewrites;
        expect(rewrites[0].to).toBe('/custom.html');
    });

    it('should preserve existing devServer config', () => {
        const base = createBaseConfig({
            mode: 'development',
            scripts: 'ts',
            styles: 'scss'
        });

        const devConfig = createDevConfig(base, {
            hot: false
        });

        expect(devConfig.devServer?.hot).toBe(false);
    });

    it('should merge devServer options correctly', () => {
        const base = createBaseConfig({
            mode: 'development',
            scripts: 'ts',
            styles: 'scss',
            appType: 'mpa',
            templates: {
                entry: 'src/views/pages'
            }
        });

        const config = createDevConfig(base, {
            port: 3000,
            historyApiFallback: {
                rewrites: [{from: /test/, to: '/test.html'}]
            }
        });

        expect(config.devServer?.port).toBe(3000);
        expect(config.devServer?.historyApiFallback).toBeDefined();
    });

    it('should call buildPlugins.applyDev and deduplicate results', () => {
        const applyDevSpy = vi.fn((config) => {
            config.plugins.push(
                new PugTemplatesPlugin({
                    entry: 'test',
                    mode: 'development',
                    appType: 'spa'
                })
            );
        });

        const mockPlugin = {
            name: 'dev-plugin',
            applyDev: applyDevSpy
        };
        const baseWithPlugins = createBaseConfig({
            mode: 'development',
            scripts: 'ts',
            styles: 'scss',
            appType: 'spa',
            buildPlugins: [mockPlugin]
        });

        const finalConfig = createDevConfig(baseWithPlugins);

        expect(applyDevSpy).toHaveBeenCalled();
        const pugPlugins = finalConfig.plugins?.filter(p => p instanceof PugTemplatesPlugin);
        expect(pugPlugins).toHaveLength(1);
    });
});
