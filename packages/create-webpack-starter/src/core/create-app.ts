import path from 'path';
import ora from 'ora';
import {
    runPipeline,
    BasePipelineContext,
    PipelineStep
} from './pipeline';
import {
    resolveTemplateStep,
    prepareDirectoryStep,
    copyTemplateStep,
    installDepsStep
} from '../steps';

import {log} from '../utils';

/**
 * Options required to create a new project.
 * This is the public API contract for programmatic usage.
 */
export type CreateAppOptions = {
    projectName: string;
    templateKey: string;
    appType: 'mpa' | 'spa';
    noInstall?: boolean;
    dryRun?: boolean;
};

/**
 * Main orchestration function for project generation.
 *
 * Responsibilities:
 * - builds initial pipeline context
 * - registers pipeline steps
 * - executes pipeline sequentially
 *
 * Can be used:
 * - from CLI (index.ts)
 * - programmatically (future use)
 *
 * @param options - project creation options
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
        dryRun: Boolean(options.dryRun)
    };

    /**
     * Register pipeline steps with strict stage typing.
     *
     * Flow:
     * BasePipelineContext
     *   → resolveTemplateStep
     * TemplateResolvedContext
     *   → prepareDirectoryStep
     *   → copyTemplateStep
     *   → installDepsStep
     */
    const steps: PipelineStep<never, unknown>[] = [
        resolveTemplateStep,              // Base → TemplateResolved
        prepareDirectoryStep(spinner),    // Base → Base (safe superset)
        copyTemplateStep(spinner),        // TemplateResolved → TemplateResolved
        installDepsStep(spinner)          // TemplateResolved → TemplateResolved
    ];

    /**
     * Execute pipeline.
     *
     * NOTE:
     * Pipeline returns the final enriched context,
     * but currently we don't need it outside.
     */
    await runPipeline<BasePipelineContext>(steps, ctx);

    log.success('Done!');
}
