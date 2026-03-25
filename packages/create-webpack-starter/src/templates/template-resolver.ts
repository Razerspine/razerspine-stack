import {templates, TemplateKey} from './templates';
import {ResolveInput} from './types';

export function resolveTemplateKey(
    input: ResolveInput
): TemplateKey | null {
    const {appType, style, script} = input;

    if (!appType || !style || !script) return null;

    for (const [key, template] of Object.entries(templates)) {
        const features = template.meta.features;

        if (!features) continue;

        if (features.appType === appType && features.style === style && features.script === script) {
            return key as TemplateKey;
        }
    }
    return null;
}
