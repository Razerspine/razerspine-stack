import {describe, it, expect, vi, beforeEach} from 'vitest';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import {prepareDirectoryStep} from '../../../src/steps';

vi.mock('fs-extra');
vi.mock('inquirer');

describe('prepareDirectoryStep', () => {
    const mockSpinner = {start: vi.fn(), succeed: vi.fn(), stop: vi.fn(), warn: vi.fn()} as any;

    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
    });

    it('should skip if dryRun is enabled', async () => {
        const ctx = {
            targetDir: '/path',
            dryRun: true,
            projectName: 'test'
        } as any;

        await prepareDirectoryStep(mockSpinner)(ctx);
        expect(fs.remove).not.toHaveBeenCalled();
    });

    it('should prompt for overwrite if directory exists and delete if confirmed', async () => {
        vi.mocked(fs.existsSync).mockReturnValue(true);
        vi.mocked(inquirer.prompt).mockResolvedValue({overwrite: true});

        const ctx = {targetDir: '/path', dryRun: false, projectName: 'test'} as any;
        await prepareDirectoryStep(mockSpinner)(ctx);

        expect(mockSpinner.stop).toHaveBeenCalled();
        expect(fs.remove).toHaveBeenCalledWith('/path');
        expect(mockSpinner.succeed).toHaveBeenCalledWith('Directory cleaned');
    });

    it('should exit process if user declines overwrite', async () => {
        vi.mocked(fs.existsSync).mockReturnValue(true);
        vi.mocked(inquirer.prompt).mockResolvedValue({overwrite: false});
        const exitSpy = vi.spyOn(process, 'exit');

        await prepareDirectoryStep(mockSpinner)({targetDir: '/path'} as any);
        expect(exitSpy).toHaveBeenCalledWith(0);
    });
});
