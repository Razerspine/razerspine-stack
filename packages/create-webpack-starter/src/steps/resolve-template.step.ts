import {PipelineStep} from '../core/pipeline';
import {BasePipelineContext, TemplateResolvedContext} from '../core/types';
import {createTemplateService} from '../core/template.service';

/**
 * Resolves the requested template and enriches the pipeline context.
 * * Output: TemplateResolvedContext (Base + template metadata)
 */
export const resolveTemplateStep: PipelineStep<
    BasePipelineContext,
    TemplateResolvedContext
> = async (ctx) => {
    const service = createTemplateService();

    const template = service.getByKey(ctx.templateKey);

    return {
        ...ctx,
        template
    };
};
