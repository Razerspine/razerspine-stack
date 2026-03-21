import {describe, it, expect, vi} from 'vitest';
import {createBaseConfig, createProdConfig} from '../../src';
import {HostingRoutingPlugin} from '../../src/plugins/hosting-routing-plugin';

vi.mock('node:fs', () => ({
    default: {
        existsSync: () => true,
        statSync: () => ({isFile: () => true, isDirectory: () => true})
    },
    existsSync: () => true,
    statSync: () => ({isFile: () => true, isDirectory: () => true}),
}));

describe('createProdConfig', () => {

    it('should include HostingRoutingPlugin and optimizations', () => {
        const base = createBaseConfig({
            mode: 'production',
            scripts: 'js',
            styles: 'less',
            appType: 'spa'
        });

        const prodConfig = createProdConfig(base);

        expect(prodConfig.optimization?.minimize).toBe(true);

        const hasPlugin = prodConfig.plugins?.some(
            (p) => p instanceof HostingRoutingPlugin
        );

        expect(hasPlugin).toBe(true);
    });

    it('should allow overriding optimization settings', () => {
        const base = createBaseConfig({
            mode: 'production',
            scripts: 'js',
            styles: 'less'
        });

        const prodConfig = createProdConfig(base, {
            optimization: {minimize: false}
        });

        expect(prodConfig.optimization?.minimize).toBe(false);
    });

    it('should merge optimization config instead of replacing', () => {
        const base = createBaseConfig({
            mode: 'production',
            scripts: 'js',
            styles: 'less'
        });

        const prodConfig = createProdConfig(base, {
            optimization: {
                splitChunks: {chunks: 'all'}
            }
        });

        expect(prodConfig.optimization?.splitChunks).toBeDefined();
        expect(prodConfig.optimization?.minimize).toBe(true);
    });

    it('should preserve plugins array', () => {
        const base = createBaseConfig({
            mode: 'production',
            scripts: 'js',
            styles: 'less'
        });

        const prodConfig = createProdConfig(base);

        expect(Array.isArray(prodConfig.plugins)).toBe(true);
        expect(prodConfig.plugins!.length).toBeGreaterThan(0);
    });
});

describe('createProdConfig integration', () => {

    it('should include HostingRoutingPlugin by default', () => {
        const config = createProdConfig({
            mode: 'production',
        } as any);

        const hasPlugin = config.plugins?.some(p => p instanceof HostingRoutingPlugin);
        expect(hasPlugin).toBe(true);
    });

    it('should set production-specific optimization', () => {
        const config = createProdConfig({});
        expect(config.optimization?.minimize).toBe(true);
    });

    it('should not duplicate HostingRoutingPlugin if user adds it via extend', () => {
        const base = createBaseConfig({
            mode: 'production',
            scripts: 'js',
            styles: 'less',
            appType: 'spa',
            plugins: {
                extend: [
                    new HostingRoutingPlugin({appType: 'spa'}),
                ]
            }
        });

        const prodConfig = createProdConfig(base);

        const routingPlugins = prodConfig.plugins?.filter(p => p instanceof HostingRoutingPlugin);
        expect(routingPlugins).toHaveLength(1);
    });

    it('should apply buildPlugins.applyProd hooks', () => {
        const applyProdSpy = vi.fn();
        const mockPlugin = {
            name: 'prod-plugin',
            applyProd: applyProdSpy
        };
        const base = createBaseConfig({
            mode: 'production',
            scripts: 'js',
            styles: 'less',
            appType: 'spa',
            buildPlugins: [mockPlugin]
        });
        createProdConfig(base);

        expect(applyProdSpy).toHaveBeenCalled();
    });
});
