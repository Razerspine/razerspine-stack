import path from 'path';
import {loadTemplates} from './template-loader';
import {LoadedTemplate} from './types';

const templatesRoot = path.resolve(__dirname, '../../templates');

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
