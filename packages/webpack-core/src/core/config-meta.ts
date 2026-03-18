import {Configuration} from 'webpack';
import {AppType} from '../types';

type ConfigMeta = {
    appType: AppType;
};

const configMeta = new WeakMap<Configuration, ConfigMeta>();

export function setConfigMeta(
    config: Configuration,
    meta: ConfigMeta
) {
    configMeta.set(config, meta);
}

export function getConfigMeta(
    config: Configuration
): ConfigMeta | undefined {
    return configMeta.get(config);
}
