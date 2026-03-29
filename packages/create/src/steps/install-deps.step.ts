import ora from 'ora';
import {PipelineStep} from '../core/pipeline';
import {TemplateResolvedContext} from '../core/types';
import {installDeps} from '../utils';

/**
 * Installs project dependencies using the selected or detected package manager.
 * * Note: Should be executed after the template files are successfully copied.
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

        spinner.start('Installing dependencies...');

        // Pass ctx.pm as the override if the user explicitly selected a package manager via CLI
        await installDeps(ctx.targetDir, ctx.pm);

        spinner.succeed('Dependencies installed');

        return ctx;
    };
};
