import {describe, it, expect} from 'vitest';
import {resolveOptions} from '../../src/options';

const base = {
    mode: 'development',
    scripts: 'ts',
    styles: 'scss'
} as const;

describe('resolveOptions (integration)', () => {

    it('should resolve appType correctly', () => {
        const options = resolveOptions({
            ...base,
            appType: 'mpa'
        });

        expect(options.appType).toBe('mpa');
    });
});
