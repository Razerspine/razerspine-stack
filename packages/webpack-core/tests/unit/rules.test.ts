import {describe, it, expect} from 'vitest';
import {assetsRule, pugRule, scriptsRule, stylesRule} from '../../src/rules';

describe('Webpack Rules', () => {

    describe('scriptsRule', () => {

        it('should return ts-loader configuration for ts script type', () => {
            const rule = scriptsRule({scripts: 'ts', mode: 'development'} as any);

            expect(rule.test.toString()).toContain('ts');
            expect((rule.use as any).loader).toBe('ts-loader');
            expect((rule.use as any).options.transpileOnly).toBe(true);
        });

        it('should return babel-loader for js script type', () => {
            const rule = scriptsRule({scripts: 'js', mode: 'production'} as any);

            expect(rule.test.toString()).toContain('js');
            expect(rule.use).toBe('babel-loader');
        });
    });

    describe('stylesRule', () => {

        it('should include sass-loader by default for scss', () => {
            const rule = stylesRule({styles: 'scss'} as any);
            const loaders = (rule.use as any[]).map(l => typeof l === 'string' ? l : l.loader);

            expect(rule.test.toString()).toContain('scss');
            expect(loaders).toContain('css-loader');
            expect(loaders).toContain('postcss-loader');
            expect(loaders).toContain('sass-loader');
        });

        it('should include less-loader and specific regex for less', () => {
            const rule = stylesRule({styles: 'less'} as any);
            const loaders = (rule.use as any[]).map(l => typeof l === 'string' ? l : l.loader);

            expect(rule.test.toString()).toContain('less');
            expect(loaders).toContain('less-loader');
            expect(loaders).not.toContain('sass-loader');
        });
    });

    describe('assetsRule', () => {

        it('should return oneOf structure for different asset types', () => {
            const rule = assetsRule();

            expect(rule).toHaveProperty('oneOf');

            const fontRegex = rule.oneOf[0].test;
            expect(fontRegex.test('font.woff2')).toBe(true);
            expect(fontRegex.test('font.woff')).toBe(true);
            expect(fontRegex.test('image.png')).toBe(false);

            expect(rule.oneOf[0].generator.filename).toContain('fonts/');
        });
    });

    describe('pugRule', () => {

        it('should return correct pug-plugin loader configuration', () => {
            const rule = pugRule();

            expect(rule.test.toString()).toContain('pug');
            expect(rule.oneOf).toBeDefined();

            expect(rule.oneOf[0].issuer.toString()).toContain('js|ts');
            expect(rule.oneOf[0].options.method).toBe('compile');
        });
    });
});
