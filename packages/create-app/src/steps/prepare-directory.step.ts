import fs from 'fs-extra';
import inquirer from 'inquirer';
import ora from 'ora';
import {PipelineStep} from '../core/pipeline';
import {BasePipelineContext} from '../core/types';
import {log} from '../utils';

/**
 * Ensures target directory is ready for project generation.
 * Handles overwrite confirmation if the directory already exists.
 * * Note: This step is generic to preserve any existing context extensions
 * (like resolved templates) while only requiring BasePipelineContext fields.
 */
export const prepareDirectoryStep = <T extends BasePipelineContext>(
    spinner: ora.Ora
): PipelineStep<T, T> => {
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
