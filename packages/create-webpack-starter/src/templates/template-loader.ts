import fs from 'fs';
import path from 'path';

export type TemplateMeta = {
    name: string;
    description: string;
    engines?: {
        node?: string;
    };
    features?: {
        appType?: 'mpa' | 'spa';
        template?: 'pug';
        style?: 'scss' | 'less';
        script?: 'js' | 'ts';
    };
};

export type LoadedTemplate = {
    key: string;
    meta: TemplateMeta;
    path: string;
    filesPath: string;
};

export function loadTemplates(templatesRoot: string): Record<string, LoadedTemplate> {
    const entries = fs.readdirSync(templatesRoot, {withFileTypes: true});

    const result: Record<string, LoadedTemplate> = {};

    for (const entry of entries) {
        if (!entry.isDirectory()) continue;

        const templateDir = path.join(templatesRoot, entry.name);
        const metaPath = path.join(templateDir, 'template.json');
        const filesPath = path.join(templateDir, 'files');

        if (!fs.existsSync(metaPath) || !fs.existsSync(filesPath)) continue;

        const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));

        result[entry.name] = {
            key: entry.name,
            meta,
            path: templateDir,
            filesPath
        };
    }

    return result;
}
