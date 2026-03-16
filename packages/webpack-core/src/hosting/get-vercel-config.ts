import {AppType} from '../types/app-type';

export function getVercelConfig(appType: AppType): string {
    const config =
        appType === 'spa'
            ? {
                routes: [
                    {
                        src: '/(.*)',
                        dest: '/index.html',
                    },
                ],
            }
            : {
                routes: [
                    {
                        handle: 'filesystem'
                    },
                    {
                        src: '/(.*)',
                        dest: '/404.html',
                        status: 404,
                    },
                ],
            };

    return JSON.stringify(config, null, 2);
}
