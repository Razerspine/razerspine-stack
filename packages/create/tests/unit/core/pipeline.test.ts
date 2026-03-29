import {describe, it, expect} from 'vitest';
import {Pipeline} from '../../../src/core/pipeline';

describe('Pipeline (Unit)', () => {

    it('should return initial context if no steps are added', async () => {
        const initialCtx = {count: 0};
        const result = await Pipeline.create<typeof initialCtx>().run(initialCtx);

        expect(result).toEqual({count: 0});
        expect(result).toBe(initialCtx);
    });

    it('should execute steps sequentially and transform context', async () => {
        type Step1Ctx = { a: number };
        type Step2Ctx = Step1Ctx & { b: string };
        type Step3Ctx = Step2Ctx & { c: boolean };

        const pipeline = Pipeline.create<Step1Ctx>()
            .addStep(async (ctx) => ({...ctx, b: 'hello'}))
            .addStep(async (ctx) => ({...ctx, c: true}));

        const result = await pipeline.run({a: 1});

        expect(result).toEqual({
            a: 1,
            b: 'hello',
            c: true
        });
    });

    it('should await asynchronous steps properly', async () => {
        const order: number[] = [];

        const pipeline = Pipeline.create<{}>()
            .addStep(async (ctx) => {
                await new Promise(resolve => setTimeout(resolve, 10));
                order.push(1);
                return ctx;
            })
            .addStep(async (ctx) => {
                order.push(2);
                return ctx;
            });

        await pipeline.run({});

        expect(order).toEqual([1, 2]);
    });
});
