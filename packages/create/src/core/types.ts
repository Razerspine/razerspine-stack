import {LoadedTemplate, AppType} from '../templates/types';

/**
 * Options required to create a new project.
 */
export type CreateAppOptions = {
    projectName: string;
    templateKey: string;
    appType: AppType;
    noInstall?: boolean;
    dryRun?: boolean;
};

/**
 * Base context shared across all pipeline steps.
 */
export type BasePipelineContext = {
    projectName: string;
    templateKey: string;
    appType: AppType;
    targetDir: string;
    noInstall: boolean;
    dryRun: boolean;
};

/**
 * Context AFTER template is resolved.
 */
export type TemplateResolvedContext = BasePipelineContext & {
    template: LoadedTemplate;
};
