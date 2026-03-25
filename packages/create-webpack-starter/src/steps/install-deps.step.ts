import ora from 'ora';
import {PipelineStep, TemplateResolvedContext} from '../core/pipeline';
import {installDeps} from '../utils';

/**
 * Installs project dependencies using npm.
 *
 * Runs after template has been copied.
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
        await installDeps(ctx.targetDir);
        spinner.succeed('Dependencies installed');

        return ctx;
    };
};
