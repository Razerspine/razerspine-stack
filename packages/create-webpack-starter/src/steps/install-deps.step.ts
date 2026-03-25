import ora from 'ora';
import {PipelineStep} from '../core/pipeline';
import {TemplateResolvedContext} from '../core/types';
import {installDeps} from '../utils';

/**
 * Installs project dependencies using the default package manager.
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
        await installDeps(ctx.targetDir);
        spinner.succeed('Dependencies installed');

        return ctx;
    };
};
