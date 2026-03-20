import {describe, it, expect, vi} from 'vitest';
import {createBaseConfig, createDevConfig} from '../../src';
import {normalizeConfigForSnapshot} from './snapshot-helper';

vi.mock('node:fs', () => ({
    existsSync: () => true,
    statSync: () => ({isFile: () => true, isDirectory: () => true}),
}));

describe('createDevConfig (snapshots)', () => {

    it('should match snapshot (SPA)', () => {
        const base = createBaseConfig({
            mode: 'development',
            scripts: 'ts',
            styles: 'scss',
            appType: 'spa'
        });
        const config = createDevConfig(base);

        expect(normalizeConfigForSnapshot(config)).toMatchSnapshot();
    });

    it('should match snapshot with devServer overrides', () => {
        const base = createBaseConfig({
            mode: 'development',
            scripts: 'ts',
            styles: 'scss'
        });
        const config = createDevConfig(base, {
            port: 9999,
            hot: true
        });

        expect(normalizeConfigForSnapshot(config)).toMatchSnapshot();
    });
});
