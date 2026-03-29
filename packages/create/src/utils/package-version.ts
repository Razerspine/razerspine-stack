import pkg from '../../package.json';

declare const __VERSION__: string | undefined;

export const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : pkg.version;
