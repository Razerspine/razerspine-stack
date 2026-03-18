/**
 * @module config-meta
 * @description Utilities for managing Webpack configuration metadata.
 * Uses a WeakMap to associate extra properties with a configuration object
 * without causing memory leaks.
 */

import {Configuration} from 'webpack';
import {AppType} from '../types';

/**
 * Metadata structure for the Webpack configuration.
 */
type ConfigMeta = {
    /** The application architecture: 'spa' (Single Page Application) or 'mpa' (Multi Page Application) */
    appType: AppType;
};

const configMeta = new WeakMap<Configuration, ConfigMeta>();

/**
 * Associates metadata with a specific Webpack configuration object.
 * @param {Configuration} config - The Webpack configuration object to tag.
 * @param {ConfigMeta} meta - The metadata to store.
 */
export function setConfigMeta(
    config: Configuration,
    meta: ConfigMeta
) {
    configMeta.set(config, meta);
}

/**
 * Retrieves metadata associated with a Webpack configuration object.
 * @param {Configuration} config - The Webpack configuration object.
 * @returns {ConfigMeta | undefined} The stored metadata or undefined if not found.
 */
export function getConfigMeta(
    config: Configuration
): ConfigMeta | undefined {
    return configMeta.get(config);
}
