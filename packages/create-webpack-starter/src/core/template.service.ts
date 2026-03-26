import path from 'path';
import {loadTemplates} from '../templates/template-loader';
import {resolveTemplateKey} from '../templates/template-resolver';
import {TemplateKey} from '../templates/templates';
import {LoadedTemplate, TemplateFeatures} from '../templates/types';

/**
 * Service responsible for managing templates.
 *
 * Responsibilities:
 * - loading templates from filesystem
 * - resolving template keys based on feature flags
 * - providing access to template metadata
 *
 * This service acts as a boundary between:
 * - filesystem layer (template-loader)
 * - pure logic layer (template-resolver)
 */
export class TemplateService {
    /**
     * Internal templates' registry.
     * Key = template directory name
     */
    private readonly templates: Record<string, LoadedTemplate>;

    /**
     * @param templatesRoot - absolute path to templates directory
     */
    constructor(private readonly templatesRoot: string) {
        this.templates = loadTemplates(this.templatesRoot);
    }

    /**
     * Returns all available templates.
     *
     * @returns map of templateKey → LoadedTemplate
     */
    getAll(): Record<string, LoadedTemplate> {
        return this.templates;
    }

    /**
     * Returns template by key.
     *
     * @param key - template identifier
     * @throws if template is not found
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
     *
     * Internally uses pure resolver function and validates result
     * against loaded templates' registry.
     *
     * @param input - selected template features
     * @returns resolved template key
     *
     * @throws if no matching template is found
     */
    resolve(input: TemplateFeatures): TemplateKey {
        const key = resolveTemplateKey(this.templates, input);

        if (!key || !this.templates[key]) {
            throw new Error(
                `No template found for appType="${input.appType}", style="${input.style}", script="${input.script}"`
            );
        }

        return key;
    }
}

/**
 * Factory helper for creating TemplateService
 * with default local templates' directory.
 *
 * Used by CLI and internal runtime.
 */
export function createTemplateService(): TemplateService {
    const templatesRoot = path.resolve(__dirname, '../../templates');
    return new TemplateService(templatesRoot);
}
