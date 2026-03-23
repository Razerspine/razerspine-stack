import {describe, it, expect} from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('CSS build', () => {

    it('ui.css exists', () => {
        const file = path.resolve(__dirname, '../../dist/css/ui.css');
        expect(fs.existsSync(file)).toBe(true);
    });

    it('contains button styles', () => {
        const css = fs.readFileSync(
            path.resolve(__dirname, '../../dist/css/ui.css'),
            'utf-8'
        );

        expect(css).toContain('.btn');
    });

});
