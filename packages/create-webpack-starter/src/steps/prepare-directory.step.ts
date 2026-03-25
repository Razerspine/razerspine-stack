import fs from 'fs-extra';
import inquirer from 'inquirer';
import ora from 'ora';
import {PipelineStep, BasePipelineContext} from '../core/pipeline';
import {log} from '../utils';

/**
 * Ensures target directory is ready.
 * Handles overwrite prompt if directory exists.
 *
 * This step runs BEFORE template resolution.
 */
export const prepareDirectoryStep = (
    spinner: ora.Ora
): PipelineStep<BasePipelineContext, BasePipelineContext> => {
    return async (ctx) => {
        if (ctx.dryRun) {
            if (fs.existsSync(ctx.targetDir)) {
                spinner.warn(`[dry-run] Directory "${ctx.projectName}" already exists`);
            }
            return ctx;
        }

        if (fs.existsSync(ctx.targetDir)) {
            spinner.stop();

            const {overwrite} = await inquirer.prompt<{ overwrite: boolean }>([
                {
                    type: 'confirm',
                    name: 'overwrite',
                    message: `Directory "${ctx.projectName}" already exists. Overwrite?`,
                    default: false
                }
            ]);

            if (!overwrite) {
                log.info('Cancelled by user');
                process.exit(0);
            }

            spinner.start('Cleaning target directory...');
            await fs.remove(ctx.targetDir);
            spinner.succeed('Directory cleaned');
        }

        return ctx;
    };
};
