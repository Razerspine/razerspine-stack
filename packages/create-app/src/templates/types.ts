/**
 * Atomic technology types supported by our templates.
 */
export type AppType = 'mpa' | 'spa';
export type StyleType = 'scss' | 'less';
export type ScriptType = 'js' | 'ts';

/**
 * A combined object representing all possible template features.
 */
export type TemplateFeatures = {
    appType: AppType;
    style: StyleType;
    script: ScriptType;
};

export type TemplateMeta = {
    name: string;
    description: string;
    engines?: {
        node?: string;
    };
    features?: Partial<TemplateFeatures> & {
        template?: 'pug';
    };
};

export type LoadedTemplate = {
    key: string;
    meta: TemplateMeta;
    path: string;
    filesPath: string;
};

export type ResolveInput = Partial<TemplateFeatures>;
