import {loadTemplates} from './template-loader';
import {LoadedTemplate} from './types';
import {getTemplatesPath} from '../utils';

const templatesRoot = getTemplatesPath();

/**
 * Loaded templates' registry.
 */
export const templates: Record<string, LoadedTemplate> =
    loadTemplates(templatesRoot);

/**
 * Template key type (string-based).
 *
 * NOTE:
 * Runtime-driven keys (derived from filesystem).
 */
export type TemplateKey = string;
