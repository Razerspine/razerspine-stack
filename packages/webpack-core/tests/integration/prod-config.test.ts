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
});
