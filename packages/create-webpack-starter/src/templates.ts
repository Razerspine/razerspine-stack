import path from 'path';
import {loadTemplates} from './template-loader';

const templatesRoot = path.resolve(__dirname, '../templates');

export const templates = loadTemplates(templatesRoot);
export type TemplateKey = keyof typeof templates;
