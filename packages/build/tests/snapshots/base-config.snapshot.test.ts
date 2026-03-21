import {describe, it, expect, vi} from 'vitest';
import {createBaseConfig} from '../../src';
import {normalizeConfigForSnapshot} from './snapshot-helper';

vi.mock('node:fs', () => ({
    existsSync: () => true,
    statSync: () => ({isFile: () => true, isDirectory: () => true}),
}));

describe('createBaseConfig (snapshots)', () => {

    it('should match snapshot (SPA)', () => {
        const config = createBaseConfig({
            mode: 'development',
            scripts: 'ts',
            styles: 'scss',
            appType: 'spa'
        });

        expect(normalizeConfigForSnapshot(config)).toMatchSnapshot();
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

        expect(normalizeConfigForSnapshot(config)).toMatchSnapshot();
    });

    it('should support templates.type = none', () => {
        const config = createBaseConfig({
            mode: 'development',
            scripts: 'ts',
            styles: 'scss',
            templates: {
                type: 'none'
            }
        });

        expect(normalizeConfigForSnapshot(config)).toMatchSnapshot();
    });
});
