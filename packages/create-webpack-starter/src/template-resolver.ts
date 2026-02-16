import {TemplateKey} from './templates';

type ResolveInput = {
    style?: 'scss' | 'less';
    script?: 'js' | 'ts';
};

export function resolveTemplateKey(
    input: ResolveInput
): TemplateKey | null {
    const {style, script} = input;

    if (!style || !script) return null;

    type FeatureKey = `${'scss' | 'less'}:${'js' | 'ts'}`;

    // canonical mapping
    const map: Record<FeatureKey, TemplateKey> = {
        'scss:js': 'pug-scss-js',
        'scss:ts': 'pug-scss-ts',
        'less:js': 'pug-less-js',
        'less:ts': 'pug-less-ts'
    };

    return map[`${style}:${script}`] ?? null;
}
