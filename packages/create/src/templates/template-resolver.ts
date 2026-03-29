import {TemplateKey} from './templates';
import {ResolveInput, LoadedTemplate} from './types';

/**
 * Resolves template key based on feature flags.
 *
 * @param templates - available templates map
 * @param input - feature selection
 * @returns matching template key or null
 */
export function resolveTemplateKey(
    templates: Record<string, LoadedTemplate>,
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
