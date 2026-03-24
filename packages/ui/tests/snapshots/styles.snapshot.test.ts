import {describe, it, expect} from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

function resolveDist() {
    const local = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(local)) return local;

    return path.resolve(process.cwd(), 'packages/ui/dist');
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
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\/\/.*$/gm, '')
        .replace(/\s+/g, ' ')
        .trim();

function getFiles(dir: string, filesList: string[] = []): string[] {
    if (!fs.existsSync(dir)) return filesList;

    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getFiles(filePath, filesList);
        } else {
            filesList.push(filePath);
        }
    }
    return filesList;
}

describe('UI Snapshots', () => {

    it('matches compiled CSS snapshot', () => {
        const cssPath = path.join(distRoot, 'css/ui.css');
        expect(fs.existsSync(cssPath)).toBe(true);
        const css = normalizeCSS(read(cssPath));
        expect(css).toMatchSnapshot();
    });

    const extensions = ['scss', 'less'];
    const targetDirs = ['settings', 'themes', 'components'];

    extensions.forEach((ext) => {
        describe(`${ext.toUpperCase()} Files`, () => {

            it(`matches ${ext} entry snapshot`, () => {
                const entryPath = path.join(distRoot, ext, `ui.${ext}`);
                expect(fs.existsSync(entryPath)).toBe(true);
                const source = normalizeSource(read(entryPath));
                expect(source).toMatchSnapshot();
            });

            targetDirs.forEach((targetDir) => {
                it(`matches snapshots for ${ext}/${targetDir}`, () => {
                    const dirPath = path.join(distRoot, ext, targetDir);

                    expect(fs.existsSync(dirPath)).toBe(true);

                    const files = getFiles(dirPath).sort();

                    const snapshots: Record<string, string> = {};

                    for (const file of files) {
                        const relativePath = path.relative(dirPath, file).replace(/\\/g, '/');
                        snapshots[relativePath] = normalizeSource(read(file));
                    }

                    expect(snapshots).toMatchSnapshot();
                });
            });
        });
    });
});
