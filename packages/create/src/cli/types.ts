import {TemplateFeatures, AppType} from '../templates/types';
import {TemplateKey} from '../templates/templates';
import {PackageManager} from '../utils';

/**
 * Raw CLI options parsed from command line.
 * We use Partial<TemplateFeatures> to avoid re-defining style, script, etc.
 */
export type CliOptions = Partial<TemplateFeatures> & {
    install?: boolean;
    dryRun?: boolean;
    pm: PackageManager
};

/**
 * Final CLI context passed to application core.
 */
export type CliContext = {
    projectName: string;
    template: TemplateKey;
    appType: AppType;
    noInstall: boolean;
    dryRun: boolean;
    pm: PackageManager;
};

export type ParsedCliInput = {
    options: CliOptions;
    projectName?: string;
    rawArgs: string[];
};
