import {HostingType} from '../types';

export function detectHosting(): HostingType {
    if (process.env.NETLIFY) return 'netlify';
    if (process.env.VERCEL) return 'vercel';
    if (process.env.CF_PAGES) return 'cloudflare';
    if (process.env.GITHUB_ACTIONS) return 'github';

    return 'static';
}
