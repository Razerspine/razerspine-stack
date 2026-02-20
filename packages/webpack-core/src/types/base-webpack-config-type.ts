import type {Configuration as WebpackConfiguration} from 'webpack';
import {AppType} from './app-type';

export type BaseWebpackConfigType = WebpackConfiguration & {
    _meta: {
        appType: AppType;
    };
}
