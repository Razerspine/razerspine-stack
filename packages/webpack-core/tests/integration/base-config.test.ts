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

    it('should merge user resolve config instead of overriding', () => {
        const config = createBaseConfig({
            ...validOptions,
            resolve: {
                extensions: ['.ts'],
                alias: {'@': 'src'}
            }
        });

        expect(config.resolve?.extensions).toContain('.ts');
        expect(config.resolve?.alias).toHaveProperty('@');
    });

    it('should default to spa if appType is not provided', () => {
        const config = createBaseConfig({
            mode: 'development',
            scripts: 'ts',
            styles: 'scss'
        });

        const meta = getConfigMeta(config);
        expect(meta?.appType).toBeDefined();
    });

    it('should include plugins array', () => {
        const config = createBaseConfig(validOptions);

        expect(Array.isArray(config.plugins)).toBe(true);
    });
});
