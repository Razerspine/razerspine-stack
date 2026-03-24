import {describe, it, expect} from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

function resolveDist() {
    const local = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(local)) return local;

    return path.resolve(process.cwd(), 'packages/pug-ui-kit/dist');
}

const distRoot = resolveDist();

const read = (p: string) => fs.readFileSync(p, 'utf-8');

const normalizeCSS = (css: string) =>
    css
        .replace(/\/\*# sourceMappingURL=.*\*\//g, '')
        .replace(/\s+/g, ' ')
        .trim();

const normalizeSource = (src: string) =>
    src
        .replace(/\s+/g, ' ')
        .trim();

describe('UI Snapshots', () => {
    it('matches compiled CSS snapshot', () => {
        const cssPath = path.join(distRoot, 'css/ui.css');

        expect(fs.existsSync(cssPath)).toBe(true);

        const css = normalizeCSS(read(cssPath));

        expect(css).toMatchSnapshot();
    });

    it('matches SCSS entry snapshot', () => {
        const scssPath = path.join(distRoot, 'scss/ui.scss');

        expect(fs.existsSync(scssPath)).toBe(true);

        const scss = normalizeSource(read(scssPath));

        expect(scss).toMatchSnapshot();
    });

    it('matches LESS entry snapshot', () => {
        const lessPath = path.join(distRoot, 'less/ui.less');

        expect(fs.existsSync(lessPath)).toBe(true);

        const less = normalizeSource(read(lessPath));

        expect(less).toMatchSnapshot();
    });
});
