import pkg from '../../package.json';

declare const __VERSION__: string | undefined;

/**
 * The current version of the package.
 * Falls back to the version from package.json if __VERSION__ global is not injected by the bundler.
 */
export const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : pkg.version;
