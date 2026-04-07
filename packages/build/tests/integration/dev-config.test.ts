import {describe, it, expect, vi} from 'vitest';
import {createBaseConfig, createDevConfig} from '../../src';
import PugPlugin from 'pug-plugin';

vi.mock('node:fs', () => ({
    default: {
        existsSync: () => true,
        statSync: () => ({
            isFile: () => true,
            isDirectory: () => true
        }),
        readdirSync: () => ['index.html']
    },
    existsSync: () => true,
    statSync: () => ({
        isFile: () => true,
        isDirectory: () => true
    }),
    readdirSync: () => ['index.html']
}));

vi.mock('pug-plugin', () => ({
    default: class PugPlugin {
        apply() {
        }
    }
}));

describe('createDevConfig', () => {

    it('should set historyApiFallback for SPA correctly', () => {
        const base = createBaseConfig({
            mode: 'development',
            scripts: 'ts',
            styles: 'scss',
            appType: 'spa',
            templates: {
                type: 'none'
            }
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
                type: 'pug',
                entry: 'src/views/pages'
            }
        });

        const devConfig = createDevConfig(base);

        const rewrites = (devConfig.devServer?.historyApiFallback as any).rewrites;
        expect(rewrites[0].to).toBe('/404.html');
    });

    it('should call buildPlugins.applyDev and deduplicate results', () => {
        const applyDevSpy = vi.fn().mockImplementation((config: any) => {
            config.plugins.push(new (PugPlugin as any)());
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
            templates: {
                type: 'pug',
                entry: 'src/index.pug'
            },
            buildPlugins: [mockPlugin]
        });

        const finalConfig = createDevConfig(baseWithPlugins);

        expect(applyDevSpy).toHaveBeenCalled();

        const pugPlugins = finalConfig.plugins?.filter(
            p => p?.constructor.name === 'PugPlugin'
        );

        expect(pugPlugins).toHaveLength(1);
    });

    it('should merge user devServer options', () => {
        const base = createBaseConfig({
            mode: 'development',
            scripts: 'ts',
            styles: 'scss',
            appType: 'mpa',
            templates: {
                type: 'pug',
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
});
