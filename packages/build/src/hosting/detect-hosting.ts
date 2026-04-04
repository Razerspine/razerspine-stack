import {HostingType} from '../types';

/**
 * Detects the current hosting/deployment environment using environment variables.
 *
 * Notes:
 *   for GitHub Pages at build time, so it falls through to 'static'.
 * - Vercel injects `VERCEL=1` during both preview and production builds.
 * - Netlify injects `NETLIFY=true` during build.
 * - Cloudflare Pages injects `CF_PAGES=1` during build.
 */
export function detectHosting(): HostingType {
    if (process.env.NETLIFY) return 'netlify';
    if (process.env.VERCEL) return 'vercel';
    if (process.env.CF_PAGES) return 'cloudflare';

    return 'static';
}
