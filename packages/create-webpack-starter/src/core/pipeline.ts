/**
 * Generic pipeline step.
 *
 * @template TIn - input context
 * @template TOut - output context (can extend TIn)
 */
export type PipelineStep<TIn, TOut = TIn> = (ctx: TIn) => Promise<TOut>;

/**
 * Orchestrates sequential execution of pipeline steps with strict type safety.
 * Uses the Builder pattern to ensure that the output of one step matches the input of the next.
 */
export class Pipeline<TInitial, TCurrent> {
    private constructor(private readonly steps: PipelineStep<any, any>[]) {
    }

    /**
     * Initializes a new pipeline with a starting context type.
     */
    static create<T>(): Pipeline<T, T> {
        return new Pipeline<T, T>([]);
    }

    /**
     * Adds a step to the pipeline.
     * TypeScript ensures that TNext of the new step is compatible with the current pipeline state.
     */
    addStep<TNext>(step: PipelineStep<TCurrent, TNext>): Pipeline<TInitial, TNext> {
        return new Pipeline<TInitial, TNext>([...this.steps, step]);
    }

    /**
     * Executes all registered steps sequentially.
     * * @param ctx - The initial context to start the pipeline with.
     * @returns The final enriched context.
     */
    async run(ctx: TInitial): Promise<TCurrent> {
        let currentCtx: any = ctx;

        for (const step of this.steps) {
            currentCtx = await step(currentCtx);
        }

        return currentCtx;
    }
}
