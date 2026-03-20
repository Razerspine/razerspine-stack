import {describe, it, expect, vi} from 'vitest';
import {createBaseConfig} from '../../src';

vi.mock('node:fs', () => ({
    existsSync: () => true,
    statSync: () => ({isFile: () => true, isDirectory: () => true}),
}));

const normalize = (config: any) => ({
    ...config,
    plugins: config.plugins ? config.plugins.map((p: any) => p?.constructor?.name || 'UnknownPlugin') : [],
});

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

    it('should match snapshot with buildPlugins mutation', () => {
        const config = createBaseConfig({
            mode: 'development',
            scripts: 'ts',
            styles: 'scss',
            buildPlugins: [
                {
                    name: 'test-modifier',
                    applyBase: (cfg) => {
                        (cfg as any).customField = 'modified-by-plugin';
                    }
                }
            ]
        });

        expect(normalize(config)).toMatchSnapshot();
    });

    it('should support templates.type = none', () => {
        const config = createBaseConfig({
            mode: 'development',
            scripts: 'ts',
            styles: 'scss',
            templates: {type: 'none'}
        });

        expect(normalize(config)).toMatchSnapshot();
    });
});
