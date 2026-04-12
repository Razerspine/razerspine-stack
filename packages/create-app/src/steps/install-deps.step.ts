import ora from 'ora';
import {PipelineStep} from '../core/pipeline';
import {TemplateResolvedContext} from '../core/types';
import {installDeps} from '../utils';

/**
 * Installs project dependencies using the selected or detected package manager.
 * Handles potential installation failures and updates the UI spinner accordingly.
 * * Note: Should be executed after the template files are successfully copied.
 * @param {ora.Ora} spinner - The CLI spinner instance for UI feedback.
 * @returns {PipelineStep<TemplateResolvedContext, TemplateResolvedContext>} The pipeline step function.
 */
export const installDepsStep = (
    spinner: ora.Ora
): PipelineStep<TemplateResolvedContext, TemplateResolvedContext> => {
    return async (ctx) => {
        if (ctx.noInstall) {
            spinner.info('Skipping install');
            return ctx;
        }

        if (ctx.dryRun) {
            spinner.info('[dry-run] Would install dependencies');
            return ctx;
        }

        try {
            spinner.start('Installing dependencies...');
            // Pass ctx.pm as the override if the user explicitly selected a package manager via CLI
            await installDeps(ctx.targetDir, ctx.pm);
            spinner.succeed('Dependencies installed');
        } catch (error) {
            spinner.fail('Failed to install dependencies');
            throw error;
        }

        return ctx;
    };
};
