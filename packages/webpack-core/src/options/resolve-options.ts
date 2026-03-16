import {ConfigOptionType} from '../types/config-option-type';
import {validateOptions} from './validate-options';
import {normalizeOptions, NormalizedCoreOptions} from './normalize-options';

export function resolveOptions(
    options: ConfigOptionType
): NormalizedCoreOptions {
    validateOptions(options);
    return normalizeOptions(options);
}
