import ora from 'ora';
import {PipelineStep} from '../core/pipeline';
import {TemplateResolvedContext} from '../core/types';
import {copyTemplate} from '../utils';

/**
 * Copies template files from the source directory to the project target directory.
 * Includes error handling to ensure the UI spinner fails gracefully on file system errors.
 * * Requirement: Needs TemplateResolvedContext to access ctx.template.
 * @param {ora.Ora} spinner - The CLI spinner instance for UI feedback.
 * @returns {PipelineStep<TemplateResolvedContext, TemplateResolvedContext>} The pipeline step function.
 */
export const copyTemplateStep = (
    spinner: ora.Ora
): PipelineStep<TemplateResolvedContext, TemplateResolvedContext> => {
    return async (ctx) => {
        if (ctx.dryRun) {
            spinner.info('[dry-run] Template would be copied');
            return ctx;
        }

        try {
            spinner.start('Copying template...');
            await copyTemplate(ctx.template.filesPath, ctx.targetDir);
            spinner.succeed('Template copied');
        } catch (error) {
            spinner.fail('Failed to copy template');
            throw error;
        }

        return ctx;
    };
};
