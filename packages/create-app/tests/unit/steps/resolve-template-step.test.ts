import {describe, it, expect, vi} from 'vitest';
import {resolveTemplateStep} from '../../../src/steps';
import {createTemplateService} from '../../../src/core/template.service';

vi.mock('../../../src/core/template.service', () => ({
    createTemplateService: vi.fn()
}));

describe('resolveTemplateStep', () => {
    it('should resolve template and enrich context', async () => {
        const mockTemplate = {
            name: 'test-template',
            filesPath: '/path'
        };
        const mockService = {
            getByKey: vi.fn().mockReturnValue(mockTemplate)
        };
        vi.mocked(createTemplateService).mockReturnValue(mockService as any);

        const ctx = {templateKey: 'web-app'} as any;
        const result = await resolveTemplateStep(ctx);

        expect(mockService.getByKey).toHaveBeenCalledWith('web-app');
        expect(result.template).toBe(mockTemplate);
        expect(result.templateKey).toBe('web-app');
    });
});
