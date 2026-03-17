import {describe, it, expect} from 'vitest';
import {getVercelConfig} from '../../../src/hosting/get-vercel-config';

describe('getVercelConfig', () => {
    it('should return valid JSON for SPA', () => {
        const result = JSON.parse(getVercelConfig('spa'));
        expect(result.routes[0].dest).toBe('/index.html');
    });

    it('should return valid JSON for MPA with filesystem handle', () => {
        const result = JSON.parse(getVercelConfig('mpa'));
        expect(result.routes).toContainEqual({handle: 'filesystem'});
        expect(result.routes[1].status).toBe(404);
    });
});
