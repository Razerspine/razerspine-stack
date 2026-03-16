import {describe, it, expect} from 'vitest';
import {resolveOptions} from '../../src/options';
import {ConfigOptionType} from '../../src';

describe('resolveOptions', () => {

    it('should resolve appType correctly', () => {
        const options = resolveOptions({
            mode: 'development',
            scripts: 'ts',
            styles: 'scss',
            appType: 'mpa'
        } as ConfigOptionType);

        expect(options.appType).toBe('mpa');
    });

    it('should set default templates.entry for SPA', () => {
        const options = resolveOptions({
            mode: 'development',
            scripts: 'ts',
            styles: 'scss',
            appType: 'spa'
        } as ConfigOptionType);

        expect(options.templates.entry).toContain('src/views/app.pug');
    });

    it('should set default templates.entry for MPA', () => {
        const options = resolveOptions({
            mode: 'development',
            scripts: 'ts',
            styles: 'scss',
            appType: 'mpa'
        } as ConfigOptionType);

        expect(options.templates.entry).toContain('src/views/pages');
    });

    it('should handle resolve aliases', () => {
        const customAlias = {'@': 'src'};
        const options = resolveOptions({
            mode: 'development',
            scripts: 'ts',
            styles: 'scss',
            resolve: {alias: customAlias}
        } as ConfigOptionType);

        expect(options.resolve.alias).toEqual(customAlias);
    });

    it('should provide empty alias object if not defined', () => {
        const options = resolveOptions({
            mode: 'development',
            scripts: 'ts',
            styles: 'scss'
        } as ConfigOptionType);

        expect(options.resolve.alias).toEqual({});
    });
});

describe('validation errors', () => {

    it('should throw error for invalid mode', () => {
        expect(() => resolveOptions({
            mode: 'production-invalid' as any,
            scripts: 'ts',
            styles: 'scss'
        } as ConfigOptionType)).toThrow('[webpack-core] Invalid mode');
    });

    it('should throw error for invalid scripts type', () => {
        expect(() => resolveOptions({
            mode: 'development',
            scripts: 'python' as any,
            styles: 'scss'
        } as ConfigOptionType)).toThrow('[webpack-core] Invalid scripts option');
    });

    it('should throw error if options are missing', () => {
        expect(() => resolveOptions(null as any)).toThrow('[webpack-core] Options are required');
    });
});
