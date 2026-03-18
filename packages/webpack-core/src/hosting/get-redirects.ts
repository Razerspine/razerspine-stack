import {AppType} from '../types';

export function getRedirects(appType: AppType): string {
    return appType === 'spa'
        ? '/* /index.html 200\n'
        : '/* /404.html 404\n';
}
