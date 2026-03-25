import {PipelineStep, BasePipelineContext, TemplateResolvedContext} from '../core/pipeline';
import {createTemplateService} from '../core/template.service';

/**
 * Resolves template and enriches pipeline context.
 *
 * Transforms:
 * BasePipelineContext → TemplateResolvedContext
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
