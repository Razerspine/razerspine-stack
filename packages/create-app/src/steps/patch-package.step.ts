import {patchPackageJson} from '../utils';
import ora from 'ora';
import {PipelineStep} from '../core/pipeline';
import {TemplateResolvedContext} from '../core/types';

/**
 * Patches the package.json file to update project metadata and adapt scripts
 * to the selected package manager.
 *
 * Responsibilities:
 * - inject project name
 * - normalize scripts (npm → pnpm/yarn/bun)
 * - add packageManager metadata
 *
 * Execution order:
 * - MUST run after template copy
 * - MUST run before dependency installation
 */
export const patchPackageStep = (
    spinner: ora.Ora
): PipelineStep<TemplateResolvedContext, TemplateResolvedContext> => {
    return async (ctx) => {
        if (ctx.dryRun) {
            spinner.info('[dry-run] Skipped patching package.json');
            return ctx;
        }

        try {
            spinner.start('Patching package.json...');

            await patchPackageJson(
                ctx.targetDir,
                ctx.projectName,
                ctx.pm
            );

            spinner.succeed('Package.json patched');
        } catch (err) {
            spinner.fail('Failed to patch package.json');
            throw err;
        }

        return ctx;
    };
};
