import fs from 'fs';
import path from 'path';
import {LoadedTemplate, TemplateMeta} from './types';

/**
 * Safely reads and parses JSON file.
 * Includes error handling to provide meaningful feedback on parse failures.
 *
 * @param filePath - absolute path to JSON file
 * @returns parsed JSON content of type T
 * @throws Error if file cannot be read or JSON is invalid
 */
function readJson<T>(filePath: string): T {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content) as T;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to parse JSON configuration at ${filePath}: ${errorMessage}`);
    }
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
