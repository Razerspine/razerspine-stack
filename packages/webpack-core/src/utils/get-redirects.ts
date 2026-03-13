import {AppType} from '../types/app-type';

export function getRedirects(appType: AppType): string {
    return appType === 'spa'
        ? '/* /index.html 200\n'
        : '/* /404.html 404\n';
}
