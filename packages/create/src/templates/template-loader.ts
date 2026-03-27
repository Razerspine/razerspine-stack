import fs from 'fs';
import path from 'path';
import {LoadedTemplate, TemplateMeta} from './types';

/**
 * Safely reads and parses JSON file.
 *
 * @param filePath - absolute path to JSON file
 */
function readJson<T>(filePath: string): T {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
}

/**
 * Loads all templates from given directory.
 *
 * Each template must contain:
 * - template.json (metadata)
 * - files/ directory (template files)
 *
 * @param templatesRoot - absolute path to templates directory
 * @returns map of templateKey → LoadedTemplate
 */
export function loadTemplates(
    templatesRoot: string
): Record<string, LoadedTemplate> {
    const entries = fs.readdirSync(templatesRoot, {withFileTypes: true});

    const result: Record<string, LoadedTemplate> = {};

    for (const entry of entries) {
        if (!entry.isDirectory()) continue;

        const templateDir = path.join(templatesRoot, entry.name);
        const metaPath = path.join(templateDir, 'template.json');
        const filesPath = path.join(templateDir, 'files');

        if (!fs.existsSync(metaPath) || !fs.existsSync(filesPath)) continue;

        const meta = readJson<TemplateMeta>(metaPath);

        result[entry.name] = {
            key: entry.name,
            meta,
            path: templateDir,
            filesPath
        };
    }

    return result;
}
