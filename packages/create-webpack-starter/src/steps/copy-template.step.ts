import ora from 'ora';
import {PipelineStep, TemplateResolvedContext} from '../core/pipeline';
import {copyTemplate} from '../utils';

/**
 * Copies template files into target directory.
 *
 * Requires:
 * - template to be resolved (TemplateResolvedContext)
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
