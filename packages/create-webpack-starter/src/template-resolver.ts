import {TemplateKey} from './templates';

export type StyleOption = 'scss' | 'less';
export type ScriptOption = 'js' | 'ts';

/**
 * Resolve template key from style + script options.
 * Pure function. No side effects.
 */
export function resolveTemplateKey(
    style: StyleOption,
    script: ScriptOption
): TemplateKey {
    return `pug-${style}-${script}` as TemplateKey;
}
