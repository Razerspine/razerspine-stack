import {describe, it, expect, vi, beforeEach} from 'vitest';
import {writeGitignoreStep} from '../../../src/steps';
import {writeGitignore} from '../../../src/utils';

vi.mock('../../../src/utils', () => ({
    writeGitignore: vi.fn()
}));

describe('writeGitignoreStep', () => {
    const mockSpinner = {
        start: vi.fn(),
        succeed: vi.fn(),
        fail: vi.fn(),
        info: vi.fn()
    } as any;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should call writeGitignore with targetDir', async () => {
        const ctx = {targetDir: '/path/my-app', dryRun: false} as any;
        await writeGitignoreStep(mockSpinner)(ctx);

        expect(writeGitignore).toHaveBeenCalledWith('/path/my-app');
        expect(mockSpinner.succeed).toHaveBeenCalled();
    });

    it('should skip and log info in dry-run mode', async () => {
        const ctx = {targetDir: '/path/my-app', dryRun: true} as any;
        await writeGitignoreStep(mockSpinner)(ctx);

        expect(writeGitignore).not.toHaveBeenCalled();
        expect(mockSpinner.info).toHaveBeenCalledWith('[dry-run] .gitignore would be written');
    });

    it('should call spinner.fail if writing fails', async () => {
        vi.mocked(writeGitignore).mockRejectedValue(new Error('EACCES'));
        const ctx = {dryRun: false} as any;

        await expect(writeGitignoreStep(mockSpinner)(ctx)).rejects.toThrow();
        expect(mockSpinner.fail).toHaveBeenCalledWith('Failed to write .gitignore');
    });
});
