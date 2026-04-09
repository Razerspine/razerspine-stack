import ora from 'ora';
import {PipelineStep} from '../core/pipeline';
import {TemplateResolvedContext} from '../core/types';
import {writeGitignore} from '../utils';

/**
 * Writes a .gitignore file to the target project directory.
 *
 * Execution order:
 * - MUST run after template copy (target directory must exist)
 */
export const writeGitignoreStep = (
    spinner: ora.Ora
): PipelineStep<TemplateResolvedContext, TemplateResolvedContext> => {
    return async (ctx) => {
        if (ctx.dryRun) {
            spinner.info('[dry-run] .gitignore would be written');
            return ctx;
        }

        try {
            spinner.start('Writing .gitignore...');
            await writeGitignore(ctx.targetDir);
            spinner.succeed('.gitignore written');
        } catch (error) {
            spinner.fail('Failed to write .gitignore');
            throw error;
        }

        return ctx;
    };
};
