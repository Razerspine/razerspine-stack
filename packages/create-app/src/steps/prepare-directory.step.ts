import fs from 'fs-extra';
import inquirer from 'inquirer';
import ora from 'ora';
import {PipelineStep} from '../core/pipeline';
import {BasePipelineContext} from '../core/types';
import {log} from '../utils';

/**
 * Ensures target directory is ready for project generation.
 * Handles overwrite confirmation if the directory already exists.
 * Gracefully handles errors during directory removal.
 * * Note: This step is generic to preserve any existing context extensions
 * (like resolved templates) while only requiring BasePipelineContext fields.
 * @param {ora.Ora} spinner - The CLI spinner instance for UI feedback.
 * @returns {PipelineStep<T, T>} The pipeline step function.
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

            try {
                spinner.start('Cleaning target directory...');
                await fs.remove(ctx.targetDir);
                spinner.succeed('Directory cleaned');
            } catch (error) {
                spinner.fail('Failed to clean target directory');
                throw error;
            }
        }

        return ctx;
    };
};
