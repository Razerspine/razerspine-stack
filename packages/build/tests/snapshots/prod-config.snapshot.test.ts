import {describe, it, expect, vi} from 'vitest';
import {createBaseConfig, createProdConfig} from '../../src';

vi.mock('node:fs', () => ({
    existsSync: () => true,
    statSync: () => ({isFile: () => true, isDirectory: () => true}),
}));

const normalize = (config: any) => ({
    ...config,
    plugins: config.plugins?.map((p: any) => p.constructor.name),
});

describe('createProdConfig (snapshots)', () => {
    it('should match snapshot (SPA)', () => {
        const base = createBaseConfig({
            mode: 'production',
            scripts: 'ts',
            styles: 'scss',
            appType: 'spa'
        });

        const config = createProdConfig(base);

        expect(normalize(config)).toMatchSnapshot();
    });

    it('should match snapshot (MPA)', () => {
        const base = createBaseConfig({
            mode: 'production',
            scripts: 'js',
            styles: 'less',
            appType: 'mpa',
            templates: {
                entry: 'src/views/pages',
            },
        });

        const config = createProdConfig(base);

        expect(normalize(config)).toMatchSnapshot();
    });
});
