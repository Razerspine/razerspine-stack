/**
 * Generic pipeline step.
 *
 * @template TIn - input context
 * @template TOut - output context (can extend TIn)
 */
export type PipelineStep<TIn, TOut = TIn> = (ctx: TIn) => Promise<TOut>;

/**
 * Orchestrates sequential execution of pipeline steps with strict type safety.
 * Uses the Builder pattern combined with Function Composition to eliminate 'any'.
 */
export class Pipeline<TInitial, TCurrent> {
    /**
     * Instead of an array of steps, we store a single executor function.
     * It encapsulates the logic of transforming TInitial into TCurrent.
     */
    private constructor(
        private readonly execute: (ctx: TInitial) => Promise<TCurrent>
    ) {
    }

    /**
     * Initializes a new pipeline with a starting context type.
     */
    static create<T>(): Pipeline<T, T> {
        // The initial state is an identity function that simply
        // returns the received context without modifications.
        return new Pipeline<T, T>(async (ctx: T) => ctx);
    }

    /**
     * Adds a new step to the pipeline.
     *
     * The step receives the current pipeline context (TCurrent)
     * and returns the next context (TNext).
     *
     * TypeScript guarantees that:
     * - the input of the step matches the current pipeline state
     * - the output becomes the new pipeline state
     *
     * @param step - pipeline transformation function
     * @returns new Pipeline instance with extended type flow
     */
    addStep<TNext>(step: PipelineStep<TCurrent, TNext>): Pipeline<TInitial, TNext> {
        // We compose a new executor function that first runs the existing chain of steps,
        // awaits their result, and then passes that result into the newly added step.
        // NOTE: The steps are NOT executed here. They are only composed.
        return new Pipeline<TInitial, TNext>(async (ctx: TInitial) => {
            const currentCtx = await this.execute(ctx);
            return step(currentCtx);
        });
    }

    /**
     * Executes all registered steps sequentially.
     *
     * @param ctx - The initial context to start the pipeline with.
     * @returns The final enriched context after all steps have been applied.
     */
    async run(ctx: TInitial): Promise<TCurrent> {
        return this.execute(ctx);
    }
}
