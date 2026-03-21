import {describe, it, expect} from 'vitest';
import {validateOptions} from '../../../src/options/validate-options';

const base = {
    mode: 'development',
    scripts: 'ts',
    styles: 'scss'
} as const;

describe('validateOptions', () => {

    it('should throw error for invalid mode', () => {
        expect(() => validateOptions({
            ...base,
            mode: 'production-invalid' as any
        })).toThrow('[build] Invalid mode');
    });

    it('should throw error for invalid scripts type', () => {
        expect(() => validateOptions({
            ...base,
            scripts: 'python' as any
        })).toThrow('[build] Invalid scripts option');
    });

    it('should throw if options are missing', () => {
        expect(() => validateOptions(null as any))
            .toThrow('[build] Options are required');
    });
});
