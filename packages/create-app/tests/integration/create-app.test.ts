import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import path from 'path';
import {createApp} from '../../src/core/create-app';
import {log} from '../../src/utils';
import type * as StepsNamespace from '../../src/steps';

vi.mock('ora', () => ({
    default: vi.fn(() => ({
        start: vi.fn().mockReturnThis(),
        succeed: vi.fn().mockReturnThis(),
        fail: vi.fn().mockReturnThis(),
        info: vi.fn().mockReturnThis(),
        warn: vi.fn().mockReturnThis(),
        stop: vi.fn().mockReturnThis(),
        text: ''
    }))
}));

vi.mock('../../src/utils', () => ({
    log: {
        success: vi.fn(),
        error: vi.fn(),
        info: vi.fn()
    }
}));

vi.mock('../../src/steps', (): typeof StepsNamespace => {
    const createStepMock = () => vi.fn(() => vi.fn(async (ctx) => ctx));

    return {
        resolveTemplateStep: vi.fn(async (ctx) => ({
            ...ctx,
            template: {filesPath: '/mock/path'} as any
        })),
        prepareDirectoryStep: createStepMock() as any,
        copyTemplateStep: createStepMock() as any,
        patchPackageStep: createStepMock() as any,
        installDepsStep: createStepMock() as any,
    };
});

describe('createApp (Unit)', () => {
    let originalCwd: () => string;

    beforeEach(() => {
        originalCwd = process.cwd;
        process.cwd = () => '/mock/cwd';
        vi.clearAllMocks();
    });

    afterEach(() => {
        process.cwd = originalCwd;
    });

    it('should build correct BasePipelineContext and execute pipeline successfully', async () => {
        const {resolveTemplateStep} = await import('../../src/steps');

        const options = {
            projectName: 'my-test-app',
            templateKey: 'spa-scss-ts' as any,
            appType: 'spa' as any,
            noInstall: true,
            dryRun: false,
            pm: 'pnpm' as const
        };

        await createApp(options);

        expect(resolveTemplateStep).toHaveBeenCalledWith(
            expect.objectContaining({
                projectName: 'my-test-app',
                templateKey: 'spa-scss-ts',
                appType: 'spa',
                targetDir: path.resolve('/mock/cwd', 'my-test-app'),
                noInstall: true,
                dryRun: false,
                pm: 'pnpm'
            })
        );

        expect(log.success).toHaveBeenCalledWith('Done!');
    });
});
