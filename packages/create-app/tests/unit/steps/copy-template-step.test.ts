import {describe, it, expect, vi, beforeEach} from 'vitest';
import {copyTemplateStep} from '../../../src/steps';
import {copyTemplate} from '../../../src/utils';

vi.mock('../../../src/utils', () => ({
    copyTemplate: vi.fn()
}));

describe('copyTemplateStep', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    })

    const mockSpinner = {
        start: vi.fn(),
        succeed: vi.fn(),
        info: vi.fn()
    } as any;

    it('should call copyTemplate with correct paths', async () => {
        const ctx = {
            targetDir: '/dest',
            template: {
                filesPath: '/src'
            },
            dryRun: false
        } as any;

        await copyTemplateStep(mockSpinner)(ctx);

        expect(mockSpinner.start).toHaveBeenCalled();
        expect(copyTemplate).toHaveBeenCalledWith('/src', '/dest');
        expect(mockSpinner.succeed).toHaveBeenCalled();
    });

    it('should show info message on dryRun', async () => {
        const ctx = {dryRun: true} as any;
        await copyTemplateStep(mockSpinner)(ctx);
        expect(mockSpinner.info).toHaveBeenCalledWith(expect.stringContaining('dry-run'));
        expect(copyTemplate).not.toHaveBeenCalled();
    });
});
