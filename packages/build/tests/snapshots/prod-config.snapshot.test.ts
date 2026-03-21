import {describe, it, expect, vi} from 'vitest';
import {createBaseConfig, createProdConfig} from '../../src';
import {normalizeConfigForSnapshot} from './snapshot-helper';

vi.mock('node:fs', () => ({
    existsSync: () => true,
    statSync: () => ({isFile: () => true, isDirectory: () => true}),
}));

describe('createProdConfig (snapshots)', () => {

    it('should match snapshot (SPA) and include HostingRoutingPlugin', () => {
        const base = createBaseConfig({
            mode: 'production',
            scripts: 'ts',
            styles: 'scss',
            appType: 'spa'
        });
        const config = createProdConfig(base);

        const normalize = normalizeConfigForSnapshot(config);

        expect(normalize).toMatchSnapshot();
        expect(normalize.plugins).toContain('HostingRoutingPlugin');
    });

    it('should match snapshot with production overrides', () => {
        const base = createBaseConfig({
            mode: 'production',
            scripts: 'js',
            styles: 'less'
        });
        const config = createProdConfig(base, {
            optimization: {
                minimize: false
            }
        });

        expect(normalizeConfigForSnapshot(config)).toMatchSnapshot();
    });
});
