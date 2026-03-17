import {ConfigOptionType} from '../types/config-option-type';
import {validateOptions} from './validate-options';
import {normalizeOptions, NormalizedCoreOptions} from './normalize-options';

export function resolveOptions(
    options: ConfigOptionType
): NormalizedCoreOptions {
    const normalized = normalizeOptions(options);
    validateOptions(normalized);
    return normalized;
}
