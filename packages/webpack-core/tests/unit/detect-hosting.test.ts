import {describe, it, expect, beforeEach, vi} from 'vitest';
import {detectHosting} from '../../src/hosting/detect-hosting';

describe('detectHosting', () => {

    beforeEach(() => {
        vi.unstubAllEnvs();
    });

    it('should detect netlify', () => {
        vi.stubEnv('NETLIFY', 'true');
        expect(detectHosting()).toBe('netlify');
    });

    it('should detect vercel', () => {
        vi.stubEnv('VERCEL', '1');
        expect(detectHosting()).toBe('vercel');
    });

    it('should detect cloudflare pages', () => {
        vi.stubEnv('CF_PAGES', 'true');
        expect(detectHosting()).toBe('cloudflare');
    });

    it('should detect github actions', () => {
        vi.stubEnv('GITHUB_ACTIONS', 'true');
        expect(detectHosting()).toBe('github');
    });

    it('should return static by default', () => {
        expect(detectHosting()).toBe('static');
    });

    it('should respect priority (netlify over vercel)', () => {
        vi.stubEnv('NETLIFY', 'true');
        vi.stubEnv('VERCEL', 'true');
        expect(detectHosting()).toBe('netlify');
    });
});
