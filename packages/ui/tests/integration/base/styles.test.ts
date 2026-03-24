import {describe, it, expect} from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const cssPath = path.resolve(__dirname, '../../../dist/css/ui.css');
const cssMinPath = path.resolve(__dirname, '../../../dist/css/ui.min.css');

function readCSS(): string {
    return fs.readFileSync(cssPath, 'utf-8');
}

describe('CSS build', () => {

    it('ui.css exists', () => {
        expect(fs.existsSync(cssPath)).toBe(true);
    });

    it('ui.min.css exists', () => {
        expect(fs.existsSync(cssMinPath)).toBe(true);
    });

    it('css is not empty', () => {
        const css = readCSS();
        expect(css.length).toBeGreaterThan(200);
    });

});

describe('Core UI styles', () => {

    it('contains button styles', () => {
        const css = readCSS();
        expect(css).toContain('.btn');
        expect(css).toContain('.btn--primary');
        expect(css).toContain('.btn--secondary');
        expect(css).toContain('.btn--outline');
        expect(css).toContain('.btn--text');
        expect(css).toContain('.btn--icon');
    });

    it('contains form controls', () => {
        const css = readCSS();

        expect(css).toContain('.form-control');
        expect(css).toContain('.form-textarea');
        expect(css).toContain('.form-group');
        expect(css).toContain('.single-select');
    });

    it('contains table styles', () => {
        const css = readCSS();
        expect(css).toContain('.table-wrapper');
        expect(css).toContain('.table');
        expect(css).toContain('.table-striped');
    });

});

describe('Modifiers & states', () => {

    it('contains size modifiers', () => {
        const css = readCSS();

        expect(css).toMatch(/--small|--medium|--large/);
    });

    it('contains state styles', () => {
        const css = readCSS();

        expect(css).toMatch(/:hover|:focus|:disabled/);
    });

});

describe('SCSS / LESS compilation integrity', () => {

    it('does not contain SCSS variables ($)', () => {
        const css = readCSS();

        expect(css).not.toMatch(/\$/);
    });

    it('does not contain LESS variables (@var)', () => {
        const css = readCSS();

        const cleaned = css.replace(/\/\*# sourceMappingURL=.*\*\//g, '');

        expect(cleaned).not.toMatch(/@\w[\w-]*\s*:/);
    });

    it('does not contain nested selector artifacts (&)', () => {
        const css = readCSS();

        expect(css).not.toContain('&');
    });

});

describe('Source maps', () => {

    it('ui.css has source map', () => {
        const mapPath = path.resolve(__dirname, '../../../dist/css/ui.css.map');
        expect(fs.existsSync(mapPath)).toBe(true);
    });

    it('ui.min.css has source map', () => {
        const mapPath = path.resolve(__dirname, '../../../dist/css/ui.min.css.map');
        expect(fs.existsSync(mapPath)).toBe(true);
    });

});
