import {describe, it, expect, vi} from 'vitest';
import {createBaseConfig, createDevConfig} from '../../src';

vi.mock('node:fs', () => ({
    existsSync: () => true,
    statSync: () => ({isFile: () => true, isDirectory: () => true}),
}));

const normalize = (config: any) => ({
    ...config,
    plugins: config.plugins?.map((p: any) => p.constructor.name),
});

describe('createDevConfig (snapshots)', () => {
    it('should match snapshot (SPA)', () => {
        const base = createBaseConfig({
            mode: 'development',
            scripts: 'ts',
            styles: 'scss',
            appType: 'spa'
        });

        const config = createDevConfig(base);

        expect(normalize(config)).toMatchSnapshot();
    });

    it('should match snapshot (MPA)', () => {
        const base = createBaseConfig({
            mode: 'development',
            scripts: 'js',
            styles: 'less',
            appType: 'mpa',
            templates: {
                entry: 'src/views/pages',
            },
        });

        const config = createDevConfig(base);

        expect(normalize(config)).toMatchSnapshot();
    });
});
