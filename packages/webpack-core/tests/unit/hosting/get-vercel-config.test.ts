import {describe, it, expect} from 'vitest';
import {getVercelConfig} from '../../../src/hosting/get-vercel-config';

describe('getVercelConfig', () => {
    it('should return valid JSON for SPA', () => {
        const result = JSON.parse(getVercelConfig('spa'));
        expect(result.rewrites).toBeDefined();
        expect(result.rewrites[0].source).toBe('/(.*)');
        expect(result.rewrites[0].destination).toBe('/index.html');
    });

    it('should return valid JSON for MPA', () => {
        const result = JSON.parse(getVercelConfig('mpa'));
        expect(result.cleanUrls).toBe(true);
        expect(result.trailingSlash).toBe(false);
        expect(result.rewrites).toBeUndefined();
    });
});
