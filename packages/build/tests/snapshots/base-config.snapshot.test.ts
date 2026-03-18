import {describe, it, expect, vi} from 'vitest';
import {createBaseConfig} from '../../src';

vi.mock('node:fs', () => ({
    existsSync: () => true,
    statSync: () => ({isFile: () => true, isDirectory: () => true}),
}));

const normalize = (config: any) => {
    return {
        ...config,
        plugins: config.plugins?.map((p: any) => p.constructor.name),
    };
};

describe('createBaseConfig (snapshots)', () => {
    it('should match snapshot (SPA)', () => {
        const config = createBaseConfig({
            mode: 'development',
            scripts: 'ts',
            styles: 'scss',
            appType: 'spa'
        });

        expect(normalize(config)).toMatchSnapshot();
    });

    it('should match snapshot (MPA)', () => {
        const config = createBaseConfig({
            mode: 'production',
            scripts: 'js',
            styles: 'less',
            appType: 'mpa',
            templates: {
                entry: 'src/views/pages',
            },
        });

        expect(normalize(config)).toMatchSnapshot();
    });
});
