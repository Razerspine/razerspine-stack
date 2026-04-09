import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import path from 'path';
import {createApp} from '../../src/core/create-app';
import {log} from '../../src/utils';
import type * as StepsNamespace from '../../src/steps';
import type {LoadedTemplate} from '../../src/templates/types';

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

    it('should build correct TemplateResolvedContext and execute pipeline successfully', async () => {
        const {prepareDirectoryStep} = await import('../../src/steps');

        const mockTemplate: LoadedTemplate = {
            key: 'spa-scss-ts',
            meta: {name: 'spa-scss-ts', description: 'SPA + SCSS + TypeScript'},
            path: '/mock/templates/spa-scss-ts',
            filesPath: '/mock/templates/spa-scss-ts/files',
        };

        const options = {
            projectName: 'my-test-app',
            template: mockTemplate,
            appType: 'spa' as const,
            noInstall: true,
            dryRun: false,
            pm: 'pnpm' as const
        };

        await createApp(options);

        const stepFn = vi.mocked(prepareDirectoryStep).mock.results[0].value;

        expect(stepFn).toHaveBeenCalledWith(
            expect.objectContaining({
                projectName: 'my-test-app',
                templateKey: 'spa-scss-ts',
                template: mockTemplate,
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
