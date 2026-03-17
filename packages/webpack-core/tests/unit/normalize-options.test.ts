import {describe, it, expect} from 'vitest';
import {normalizeOptions} from '../../src/options/normalize-options';

const base = {
    mode: 'development',
    scripts: 'ts',
    styles: 'scss'
} as const;

describe('normalizeOptions', () => {

    it('should set default templates.entry for SPA', () => {
        const options = normalizeOptions({
            ...base,
            appType: 'spa'
        });

        expect(options.templates.entry)
            .toContain('src/views/app.pug');
    });

    it('should set default templates.entry for MPA', () => {
        const options = normalizeOptions({
            ...base,
            appType: 'mpa'
        });

        expect(options.templates.entry)
            .toContain('src/views/pages');
    });

    it('should handle resolve aliases', () => {
        const customAlias = {'@': 'src'};

        const options = normalizeOptions({
            ...base,
            resolve: {alias: customAlias}
        });

        expect(options.resolve.alias).toEqual(customAlias);
    });

    it('should provide empty alias object if not defined', () => {
        const options = normalizeOptions(base);

        expect(options.resolve.alias).toEqual({});
    });
});
