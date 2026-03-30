import {describe, it, expect, vi} from 'vitest';
import {patchPackageStep} from '../../../src/steps';
import {patchPackageJson} from '../../../src/utils';

vi.mock('../../../src/utils', () => ({
    patchPackageJson: vi.fn()
}));

describe('patchPackageStep', () => {
    const mockSpinner = {
        start: vi.fn(),
        succeed: vi.fn(),
        fail: vi.fn(),
        info: vi.fn()
    } as any;

    it('should call patchPackageJson with context data', async () => {
        const ctx = {
            targetDir: '/path',
            projectName: 'my-app',
            pm: 'npm',
            dryRun: false
        } as any;
        await patchPackageStep(mockSpinner)(ctx);

        expect(patchPackageJson).toHaveBeenCalledWith('/path', 'my-app', 'npm');
        expect(mockSpinner.succeed).toHaveBeenCalled();
    });

    it('should call spinner.fail if patching fails', async () => {
        vi.mocked(patchPackageJson).mockRejectedValue(new Error('Failed'));
        const ctx = {dryRun: false} as any;

        await expect(patchPackageStep(mockSpinner)(ctx)).rejects.toThrow();
        expect(mockSpinner.fail).toHaveBeenCalledWith('Failed to patch package.json');
    });
});
