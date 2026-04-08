import {describe, it, expect, vi, beforeEach} from 'vitest';
import * as fs from 'node:fs';
import {StaticCopyPlugin, createStaticCopyPlugin} from '../../../src/plugins/static-copy-plugin';

vi.mock('node:fs', () => ({
    promises: {
        access: vi.fn(),
        readdir: vi.fn(),
        stat: vi.fn(),
        readFile: vi.fn(),
    },
}));

describe('StaticCopyPlugin', () => {
    let mockCompiler: any;
    let mockCompilation: any;
    let mockLogger: any;
    let tapPromiseCallback: () => Promise<void>;

    beforeEach(() => {
        vi.clearAllMocks();

        mockLogger = {
            info: vi.fn(),
            warn: vi.fn(),
        };

        mockCompilation = {
            hooks: {
                processAssets: {
                    tapPromise: vi.fn((options, cb) => {
                        tapPromiseCallback = cb;
                    }),
                },
            },
            emitAsset: vi.fn(),
            contextDependencies: {
                add: vi.fn(),
            },
        };

        mockCompiler = {
            context: '/project',
            getInfrastructureLogger: vi.fn().mockReturnValue(mockLogger),
            hooks: {
                thisCompilation: {
                    tap: vi.fn((name, callback) => callback(mockCompilation)),
                },
            },
        };
    });

    it('should do nothing when static/ directory does not exist', async () => {
        vi.mocked(fs.promises.access).mockRejectedValue(new Error('ENOENT'));

        const plugin = new StaticCopyPlugin();
        plugin.apply(mockCompiler);
        await tapPromiseCallback();

        expect(mockCompilation.emitAsset).not.toHaveBeenCalled();
        expect(mockLogger.info).not.toHaveBeenCalled();
    });

    it('should always register contextDependencies for watch mode', async () => {
        vi.mocked(fs.promises.access).mockRejectedValue(new Error('ENOENT'));

        const plugin = new StaticCopyPlugin();
        plugin.apply(mockCompiler);
        await tapPromiseCallback();

        expect(mockCompilation.contextDependencies.add).toHaveBeenCalledWith('/project/static');
    });

    it('should do nothing when static/ directory is empty', async () => {
        vi.mocked(fs.promises.access).mockResolvedValue(undefined);
        vi.mocked(fs.promises.readdir).mockResolvedValue([] as any);

        const plugin = new StaticCopyPlugin();
        plugin.apply(mockCompiler);
        await tapPromiseCallback();

        expect(mockCompilation.emitAsset).not.toHaveBeenCalled();
        expect(mockLogger.info).not.toHaveBeenCalled();
    });

    it('should emit flat files from static/ to dist/', async () => {
        vi.mocked(fs.promises.access).mockResolvedValue(undefined);
        vi.mocked(fs.promises.readdir).mockResolvedValue(['robots.txt', 'favicon.ico'] as any);
        vi.mocked(fs.promises.stat).mockResolvedValue({isDirectory: () => false} as any);
        vi.mocked(fs.promises.readFile).mockImplementation((filePath: any) =>
            Promise.resolve(Buffer.from(`content-of-${String(filePath).split('/').pop()}`)) as any
        );

        const plugin = new StaticCopyPlugin();
        plugin.apply(mockCompiler);
        await tapPromiseCallback();

        expect(mockCompilation.emitAsset).toHaveBeenCalledTimes(2);
        expect(mockCompilation.emitAsset).toHaveBeenCalledWith(
            'robots.txt',
            expect.objectContaining({_value: expect.any(Buffer)})
        );
        expect(mockCompilation.emitAsset).toHaveBeenCalledWith(
            'favicon.ico',
            expect.objectContaining({_value: expect.any(Buffer)})
        );
    });

    it('should recursively copy nested files preserving directory structure', async () => {
        vi.mocked(fs.promises.access).mockResolvedValue(undefined);

        vi.mocked(fs.promises.readdir).mockImplementation((dir: any) => {
            const d = String(dir);
            if (d === '/project/static') return Promise.resolve(['images', 'robots.txt'] as any);
            if (d === '/project/static/images') return Promise.resolve(['logo.png'] as any);
            return Promise.resolve([] as any);
        });

        vi.mocked(fs.promises.stat).mockImplementation((filePath: any) => {
            const p = String(filePath);
            return Promise.resolve({isDirectory: () => p === '/project/static/images'} as any);
        });

        vi.mocked(fs.promises.readFile).mockResolvedValue(Buffer.from('data') as any);

        const plugin = new StaticCopyPlugin();
        plugin.apply(mockCompiler);
        await tapPromiseCallback();

        expect(mockCompilation.emitAsset).toHaveBeenCalledTimes(2);
        expect(mockCompilation.emitAsset).toHaveBeenCalledWith('images/logo.png', expect.anything());
        expect(mockCompilation.emitAsset).toHaveBeenCalledWith('robots.txt', expect.anything());
    });

    it('should log info with file count when copying', async () => {
        vi.mocked(fs.promises.access).mockResolvedValue(undefined);
        vi.mocked(fs.promises.readdir).mockResolvedValue(['file.txt'] as any);
        vi.mocked(fs.promises.stat).mockResolvedValue({isDirectory: () => false} as any);
        vi.mocked(fs.promises.readFile).mockResolvedValue(Buffer.from('') as any);

        const plugin = new StaticCopyPlugin();
        plugin.apply(mockCompiler);
        await tapPromiseCallback();

        expect(mockLogger.info).toHaveBeenCalledWith(
            expect.stringContaining('1 file(s) from static/ to dist/')
        );
    });

    it('should use PROCESS_ASSETS_STAGE_ADDITIONAL stage', async () => {
        vi.mocked(fs.promises.access).mockRejectedValue(new Error('ENOENT'));

        const plugin = new StaticCopyPlugin();
        plugin.apply(mockCompiler);
        await tapPromiseCallback();

        expect(mockCompilation.hooks.processAssets.tapPromise).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'StaticCopyPlugin',
                stage: expect.any(Number),
            }),
            expect.any(Function)
        );
    });
});

describe('createStaticCopyPlugin', () => {
    it('should push StaticCopyPlugin into config.plugins via applyBase', () => {
        const factory = createStaticCopyPlugin();
        const config: any = {plugins: []};

        factory.applyBase!(config);

        expect(config.plugins).toHaveLength(1);
        expect(config.plugins[0]).toBeInstanceOf(StaticCopyPlugin);
    });

    it('should initialize config.plugins if not present', () => {
        const factory = createStaticCopyPlugin();
        const config: any = {};

        factory.applyBase!(config);

        expect(config.plugins).toHaveLength(1);
    });

    it('should have name "static-copy"', () => {
        const factory = createStaticCopyPlugin();
        expect(factory.name).toBe('static-copy');
    });
});
