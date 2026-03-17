import {describe, it, expect} from 'vitest';
import {setConfigMeta, getConfigMeta} from '../../src/core/config-meta';
import {Configuration} from 'webpack';

describe('config-meta', () => {
    it('should store and retrieve appType correctly', () => {
        const config: Configuration = {};
        const meta = {appType: 'mpa' as const};

        setConfigMeta(config, meta);
        const retrieved = getConfigMeta(config);

        expect(retrieved).toEqual(meta);
        expect(retrieved?.appType).toBe('mpa');
    });

    it('should return undefined for config without meta', () => {
        const config: Configuration = {};
        expect(getConfigMeta(config)).toBeUndefined();
    });
});
