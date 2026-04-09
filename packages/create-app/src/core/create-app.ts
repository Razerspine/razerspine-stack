import path from 'path';
import ora from 'ora';
import {Pipeline} from './pipeline';
import {
    prepareDirectoryStep,
    copyTemplateStep,
    installDepsStep,
    patchPackageStep
} from '../steps';
import {log} from '../utils';
import {CreateAppOptions, TemplateResolvedContext} from './types';

/**
 * Main orchestration function for project generation.
 *
 * Responsibilities:
 * - builds initial pipeline context (template already resolved by CLI)
 * - assembles pipeline using the Builder pattern
 * - executes pipeline steps sequentially
 * - patches package.json with project-specific metadata
 */
export async function createApp(options: CreateAppOptions): Promise<void> {
    const spinner = ora();

    /**
     * Initial pipeline context — template is already resolved by the CLI layer,
     * so the pipeline starts with TemplateResolvedContext directly.
     */
    const ctx: TemplateResolvedContext = {
        projectName: options.projectName,
        templateKey: options.template.key,
        template: options.template,
        appType: options.appType,
        targetDir: path.resolve(process.cwd(), options.projectName),
        noInstall: Boolean(options.noInstall),
        dryRun: Boolean(options.dryRun),
        pm: options.pm
    };

    /**
     * Execute pipeline with strict type flow.
     *
     * 1. prepareDirectoryStep  — TemplateResolvedContext -> TemplateResolvedContext
     * 2. copyTemplateStep      — TemplateResolvedContext -> TemplateResolvedContext
     * 3. patchPackageStep      — TemplateResolvedContext -> TemplateResolvedContext
     * 4. installDepsStep       — TemplateResolvedContext -> TemplateResolvedContext
     */
    await Pipeline.create<TemplateResolvedContext>()
        .addStep(prepareDirectoryStep(spinner))
        .addStep(copyTemplateStep(spinner))
        .addStep(patchPackageStep(spinner))
        .addStep(installDepsStep(spinner))
        .run(ctx);

    log.success('Done!');
}
