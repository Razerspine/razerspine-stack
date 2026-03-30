import {describe, it, expect, afterEach, vi} from 'vitest';
import {parseCliArgs} from '../../../src/cli/parse-args';

describe('parseCliArgs (Unit)', () => {
    const originalArgv = process.argv;

    afterEach(() => {
        process.argv = originalArgv;
        vi.clearAllMocks();
    });

    const setArgs = (...args: string[]) => {
        process.argv = ['node', 'create', ...args];
    };

    it('should parse project name correctly', () => {
        setArgs('my-awesome-app');
        const result = parseCliArgs();

        expect(result.projectName).toBe('my-awesome-app');
        expect(result.rawArgs).toEqual(['my-awesome-app']);
    });

    it('should parse string flags and options correctly', () => {
        setArgs('my-app', '--app-type', 'spa', '--style', 'scss', '--script', 'ts', '--pm', 'yarn');
        const {options} = parseCliArgs();

        expect(options.appType).toBe('spa');
        expect(options.style).toBe('scss');
        expect(options.script).toBe('ts');
        expect(options.pm).toBe('yarn');
    });

    it('should parse boolean flags correctly (--no-install, --dry-run)', () => {
        setArgs('my-app', '--no-install', '--dry-run');
        const {options} = parseCliArgs();

        expect(options.install).toBe(false);
        expect(options.dryRun).toBe(true);
    });

    it('should provide default value for package manager', () => {
        setArgs('my-app');
        const {options} = parseCliArgs();

        expect(options.pm).toBe('npm');
    });

    it('should handle missing project name', () => {
        setArgs();
        const result = parseCliArgs();

        expect(result.projectName).toBeUndefined();
        expect(result.rawArgs).toEqual([]);
    });
});
