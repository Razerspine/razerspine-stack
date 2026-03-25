import {LoadedTemplate} from '../templates/template-loader';

/**
 * Base context shared across all pipeline steps.
 */
export type BasePipelineContext = {
    projectName: string;
    templateKey: string;
    appType: 'mpa' | 'spa';
    targetDir: string;
    noInstall: boolean;
    dryRun: boolean;
};

/**
 * Context AFTER template is resolved.
 */
export type TemplateResolvedContext = BasePipelineContext & {
    template: LoadedTemplate;
};

/**
 * Generic pipeline step.
 *
 * @template TIn - input context
 * @template TOut - output context (can extend TIn)
 */
export type PipelineStep<TIn, TOut = TIn> = (ctx: TIn) => Promise<TOut>;

/**
 * Runs pipeline steps sequentially with strict typing.
 *
 * NOTE:
 * This version enforces step-by-step context transformation.
 *
 * @param steps - ordered pipeline steps
 * @param ctx - initial context
 */
export async function runPipeline<TCtx, TResult = unknown>(
    steps: PipelineStep<never, unknown>[],
    ctx: TCtx
): Promise<TResult> {
    let currentCtx: unknown = ctx;

    for (const step of steps) {
        currentCtx = await step(currentCtx as never);
    }

    return currentCtx as TResult;
}
