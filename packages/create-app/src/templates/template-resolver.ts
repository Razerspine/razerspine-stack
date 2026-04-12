import {TemplateKey} from './templates';
import {ResolveInput, LoadedTemplate} from './types';

/**
 * Resolves template key based on feature flags.
 * Optimized condition checking for better readability.
 *
 * @param templates - available templates map
 * @param input - feature selection
 * @returns matching template key or null if no match is found
 */
export function resolveTemplateKey(
    templates: Record<string, LoadedTemplate>,
    input: ResolveInput
): TemplateKey | null {
    const {appType, style, script} = input;

    if (!appType || !style || !script) return null;

    for (const [key, template] of Object.entries(templates)) {
        const features = template.meta.features;

        if (
            features &&
            features.appType === appType &&
            features.style === style &&
            features.script === script
        ) {
            return key as TemplateKey;
        }
    }

    return null;
}
