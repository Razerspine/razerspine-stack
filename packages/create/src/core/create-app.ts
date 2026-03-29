import path from 'path';
import ora from 'ora';
import {Pipeline} from './pipeline';
import {
    resolveTemplateStep,
    prepareDirectoryStep,
    copyTemplateStep,
    installDepsStep,
    patchPackageStep
} from '../steps';
import {log} from '../utils';
import {CreateAppOptions, BasePipelineContext} from './types';

/**
 * Main orchestration function for project generation.
 *
 * Responsibilities:
 * - builds initial pipeline context
 * - assembles pipeline using the Builder pattern
 * - executes pipeline steps sequentially
 * - patches package.json with project-specific metadata
 */
export async function createApp(options: CreateAppOptions): Promise<void> {
    const spinner = ora();

    /**
     * Initial pipeline context (before template is resolved)
     */
    const ctx: BasePipelineContext = {
        projectName: options.projectName,
        templateKey: options.templateKey,
        appType: options.appType,
        targetDir: path.resolve(process.cwd(), options.projectName),
        noInstall: Boolean(options.noInstall),
        dryRun: Boolean(options.dryRun),
        pm: options.pm
    };

    /**
     * Execute pipeline with strict type flow.
     *
     * Type transitions:
     * 1. create<BasePipelineContext>()
     * -> initial context
     *
     * 2. resolveTemplateStep
     * BasePipelineContext -> TemplateResolvedContext
     *
     * 3. prepareDirectoryStep
     * TemplateResolvedContext -> TemplateResolvedContext
     *
     * 4. copyTemplateStep
     * TemplateResolvedContext -> TemplateResolvedContext
     *
     * 5. patchPackageStep
     * TemplateResolvedContext -> TemplateResolvedContext
     *
     * 6. installDepsStep
     * TemplateResolvedContext -> TemplateResolvedContext
     *
     * Final result:
     * Promise<TemplateResolvedContext>
     */
    await Pipeline.create<BasePipelineContext>()
        .addStep(resolveTemplateStep)
        .addStep(prepareDirectoryStep(spinner))
        .addStep(copyTemplateStep(spinner))
        .addStep(patchPackageStep(spinner))
        .addStep(installDepsStep(spinner))
        .run(ctx);

    log.success('Done!');
}
