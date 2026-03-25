import path from 'path';
import {loadTemplates, LoadedTemplate} from '../templates/template-loader';
import {resolveTemplateKey} from '../templates/template-resolver';
import {TemplateKey} from '../templates/templates';

/**
 * Service responsible for:
 * - loading templates
 * - resolving template by features
 * - providing access to template metadata
 */
export class TemplateService {
    private readonly templates: Record<string, LoadedTemplate>;

    constructor(private readonly templatesRoot: string) {
        this.templates = loadTemplates(this.templatesRoot);
    }

    /**
     * Returns all available templates.
     */
    getAll(): Record<string, LoadedTemplate> {
        return this.templates;
    }

    /**
     * Returns template by key.
     */
    getByKey(key: TemplateKey): LoadedTemplate {
        const template = this.templates[key];

        if (!template) {
            throw new Error(`Template "${key}" not found`);
        }

        return template;
    }

    /**
     * Resolves template key from feature flags.
     */
    resolve(input: {
        appType: 'mpa' | 'spa';
        style: 'scss' | 'less';
        script: 'js' | 'ts';
    }): TemplateKey {
        const key = resolveTemplateKey(input);

        if (!key || !this.templates[key]) {
            throw new Error(
                `No template found for appType="${input.appType}", style="${input.style}", script="${input.script}"`
            );
        }

        return key;
    }
}

/**
 * Factory helper (default local templates).
 */
export function createTemplateService(): TemplateService {
    const templatesRoot = path.resolve(__dirname, '../../templates');
    return new TemplateService(templatesRoot);
}
