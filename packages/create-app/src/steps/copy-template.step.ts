import ora from 'ora';
import {PipelineStep} from '../core/pipeline';
import {TemplateResolvedContext} from '../core/types';
import {copyTemplate} from '../utils';

/**
 * Copies template files from the source directory to the project target directory.
 * * Requirement: Needs TemplateResolvedContext to access ctx.template.
 */
export const copyTemplateStep = (
    spinner: ora.Ora
): PipelineStep<TemplateResolvedContext, TemplateResolvedContext> => {
    return async (ctx) => {
        if (ctx.dryRun) {
            spinner.info('[dry-run] Template would be copied');
            return ctx;
        }

        spinner.start('Copying template...');
        await copyTemplate(ctx.template.filesPath, ctx.targetDir);
        spinner.succeed('Template copied');

        return ctx;
    };
};
