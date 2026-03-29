import {TemplateKey} from '../templates/templates';
import {createTemplateService} from '../core/template.service';
import {TemplateFeatures} from '../templates/types';

/**
 * Resolves template key using TemplateService.
 */
export function resolveTemplate(input: TemplateFeatures): TemplateKey {
    const service = createTemplateService();
    return service.resolve(input);
}
