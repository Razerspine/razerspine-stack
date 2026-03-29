import {describe, it, expect, vi, beforeEach} from 'vitest';
import {installDepsStep} from '../../../src/steps';
import {installDeps} from '../../../src/utils';

vi.mock('../../../src/utils', () => ({
    installDeps: vi.fn()
}));

describe('installDepsStep', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockSpinner = {
        start: vi.fn(),
        succeed: vi.fn(),
        info: vi.fn()
    } as any;

    it('should install dependencies if conditions are met', async () => {
        const ctx = {
            targetDir: '/path',
            pm: 'npm',
            noInstall: false,
            dryRun: false
        } as any;

        await installDepsStep(mockSpinner)(ctx);

        expect(mockSpinner.start).toHaveBeenCalledWith('Installing dependencies...');

        expect(installDeps).toHaveBeenCalledWith('/path', 'npm');

        expect(mockSpinner.succeed).toHaveBeenCalled();
    });

    it('should skip installation if noInstall is true', async () => {
        const ctx = {noInstall: true} as any;
        await installDepsStep(mockSpinner)(ctx);

        expect(mockSpinner.info).toHaveBeenCalledWith('Skipping install');
        expect(installDeps).not.toHaveBeenCalled();
    });

    it('should skip on dryRun', async () => {
        const ctx = {noInstall: false, dryRun: true} as any;
        await installDepsStep(mockSpinner)(ctx);

        expect(mockSpinner.info).toHaveBeenCalledWith(expect.stringContaining('dry-run'));
        expect(installDeps).not.toHaveBeenCalled();
    });
});
