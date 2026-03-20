import {describe, it, expect, vi} from 'vitest';
import {createBaseConfig, createProdConfig} from '../../src';

vi.mock('node:fs', () => ({
    existsSync: () => true,
    statSync: () => ({isFile: () => true, isDirectory: () => true}),
}));

const normalize = (config: any) => ({
    ...config,
    plugins: config.plugins ? config.plugins.map((p: any) => p?.constructor?.name || 'UnknownPlugin') : [],
});

describe('createProdConfig (snapshots)', () => {

    it('should match snapshot (SPA) and include HostingRoutingPlugin', () => {
        const base = createBaseConfig({
            mode: 'production',
            scripts: 'ts',
            styles: 'scss',
            appType: 'spa'
        });
        const config = createProdConfig(base);

        const norm = normalize(config);

        expect(norm).toMatchSnapshot();
        expect(norm.plugins).toContain('HostingRoutingPlugin');
    });

    it('should match snapshot with production overrides', () => {
        const base = createBaseConfig({
            mode: 'production',
            scripts: 'js',
            styles: 'less'
        });
        const config = createProdConfig(base, {
            optimization: {minimize: false}
        });

        expect(normalize(config)).toMatchSnapshot();
    });
});
