import {LoadedTemplate, AppType} from '../templates/types';
import {PackageManager} from '../utils';

/**
 * Options required to create a new project.
 */
export type CreateAppOptions = {
    projectName: string;
    templateKey: string;
    appType: AppType;
    noInstall?: boolean;
    dryRun?: boolean;
    pm: PackageManager;
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
    pm: PackageManager;
};

/**
 * Context AFTER template is resolved.
 */
export type TemplateResolvedContext = BasePipelineContext & {
    template: LoadedTemplate;
};
