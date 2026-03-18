import {describe, it, expect} from 'vitest';
import {getRedirects} from '../../../src/hosting/get-redirects';

describe('getRedirects', () => {
    it('should return SPA redirect rules', () => {
        const result = getRedirects('spa');
        expect(result).toBe('/* /index.html 200\n');
    });

    it('should return MPA redirect rules', () => {
        const result = getRedirects('mpa');
        expect(result).toBe('/* /404.html 404\n');
    });
});
