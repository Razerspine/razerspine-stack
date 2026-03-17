import {describe, it, expect, vi} from 'vitest';
import * as fs from 'node:fs';
import {PugTemplatesPlugin} from '../../src/plugins/pug-templates-plugin';

vi.mock('node:fs', () => ({
    existsSync: vi.fn(() => true),
    statSync: vi.fn(() => ({
        isFile: () => true,
        isDirectory: () => false
    }))
}));

describe('PugTemplatesPlugin', () => {

    it('should throw if SPA entry is not a file', () => {
        vi.mocked(fs.statSync).mockReturnValue({
            isFile: () => false,
            isDirectory: () => true
        } as any);

        expect(() => new PugTemplatesPlugin({
            entry: 'test.pug',
            mode: 'development',
            appType: 'spa'
        })).toThrow('SPA requires a single pug file');
    });
});
