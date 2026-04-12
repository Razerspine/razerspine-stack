import {createTemplateService} from '../core/template.service';
import {TemplateFeatures, LoadedTemplate} from '../templates/types';

/**
 * Resolves and returns the full LoadedTemplate using a single TemplateService instance.
 */
export function resolveTemplate(input: TemplateFeatures): LoadedTemplate {
    const service = createTemplateService();
    const key = service.resolve(input);
    return service.getByKey(key);
}
