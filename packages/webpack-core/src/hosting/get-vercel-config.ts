import {AppType} from '../types';

export function getVercelConfig(appType: AppType): string {
    // Vercel recommends using 'rewrites' for SPA fallback logic
    const config =
        appType === 'spa'
            ? {
                rewrites: [
                    {
                        source: '/(.*)',
                        destination: '/index.html',
                    },
                ],
            }
            : {
                // For MPA, we don't strictly need rewrites for 404
                // if we have a 404.html file, but we can keep it for clean URLs
                cleanUrls: true,
                trailingSlash: false
            };

    return JSON.stringify(config, null, 2);
}
