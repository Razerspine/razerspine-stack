import {TemplateKey} from '../templates/templates';
import {createTemplateService} from '../core/template.service';

/**
 * Resolves template key using TemplateService.
 */
export function resolveTemplate(input: {
    appType: 'mpa' | 'spa';
    style: 'scss' | 'less';
    script: 'js' | 'ts';
}): TemplateKey {
    const service = createTemplateService();
    return service.resolve(input);
}
