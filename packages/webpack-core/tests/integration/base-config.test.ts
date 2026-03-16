import {describe, it, expect, vi} from 'vitest';
import {createBaseConfig} from '../../src';
import {ConfigOptionType} from '../../src';
import {getConfigMeta} from '../../src/core/config-meta';

vi.mock('node:fs', () => ({
    default: {
        existsSync: () => true,
        statSync: () => ({isFile: () => true, isDirectory: () => true})
    },
    existsSync: () => true,
    statSync: () => ({isFile: () => true, isDirectory: () => true}),
}));

const validOptions: ConfigOptionType = {
    mode: 'development',
    scripts: 'ts',
    styles: 'scss',
    appType: 'spa'
};

describe('createBaseConfig', () => {

    it('should generate valid webpack config and set metadata', () => {
        const config = createBaseConfig(validOptions);

        expect(config.mode).toBe('development');
        expect(config.output?.clean).toBe(true);

        const meta = getConfigMeta(config);
        expect(meta?.appType).toBe('spa');
    });

    it('should apply aliases to resolve object', () => {
        const optionsWithAlias: ConfigOptionType = {
            ...validOptions,
            resolve: {alias: {'@': 'src'}}
        };
        const config = createBaseConfig(optionsWithAlias);
        expect(config.resolve?.alias).toHaveProperty('@', 'src');
    });
});
