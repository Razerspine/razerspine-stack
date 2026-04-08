import {describe, it, expect, vi, beforeEach} from 'vitest';
import * as fs from 'node:fs';
import {StaticCopyPlugin, createStaticCopyPlugin} from '../../../src/plugins/static-copy-plugin';

vi.mock('node:fs');

describe('StaticCopyPlugin', () => {
    let mockCompiler: any;
    let mockCompilation: any;
    let mockLogger: any;

    beforeEach(() => {
        vi.clearAllMocks();

        mockLogger = {
            info: vi.fn(),
            warn: vi.fn(),
        };

        mockCompilation = {
            hooks: {
                processAssets: {
                    tap: vi.fn((options, callback) => callback()),
                },
            },
            emitAsset: vi.fn(),
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

    it('should do nothing when static/ directory does not exist', () => {
        vi.mocked(fs.existsSync).mockReturnValue(false);

        const plugin = new StaticCopyPlugin();
        plugin.apply(mockCompiler);

        expect(mockCompilation.emitAsset).not.toHaveBeenCalled();
        expect(mockLogger.info).not.toHaveBeenCalled();
    });

    it('should do nothing when static/ directory is empty', () => {
        vi.mocked(fs.existsSync).mockReturnValue(true);
        vi.mocked(fs.readdirSync).mockReturnValue([] as any);

        const plugin = new StaticCopyPlugin();
        plugin.apply(mockCompiler);

        expect(mockCompilation.emitAsset).not.toHaveBeenCalled();
        expect(mockLogger.info).not.toHaveBeenCalled();
    });

    it('should emit flat files from static/ to dist/', () => {
        vi.mocked(fs.existsSync).mockReturnValue(true);
        vi.mocked(fs.readdirSync).mockReturnValue(['robots.txt', 'favicon.ico'] as any);
        vi.mocked(fs.statSync).mockReturnValue({isDirectory: () => false} as any);
        vi.mocked(fs.readFileSync).mockImplementation((filePath: any) =>
            Buffer.from(`content-of-${String(filePath).split('/').pop()}`)
        );

        const plugin = new StaticCopyPlugin();
        plugin.apply(mockCompiler);

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

    it('should recursively copy nested files preserving directory structure', () => {
        vi.mocked(fs.existsSync).mockReturnValue(true);

        vi.mocked(fs.readdirSync).mockImplementation((dir: any) => {
            const d = String(dir);
            if (d === '/project/static') return ['images', 'robots.txt'] as any;
            if (d === '/project/static/images') return ['logo.png'] as any;
            return [] as any;
        });

        vi.mocked(fs.statSync).mockImplementation((filePath: any) => {
            const p = String(filePath);
            return {isDirectory: () => p === '/project/static/images'} as any;
        });

        vi.mocked(fs.readFileSync).mockReturnValue(Buffer.from('data'));

        const plugin = new StaticCopyPlugin();
        plugin.apply(mockCompiler);

        expect(mockCompilation.emitAsset).toHaveBeenCalledTimes(2);
        expect(mockCompilation.emitAsset).toHaveBeenCalledWith('images/logo.png', expect.anything());
        expect(mockCompilation.emitAsset).toHaveBeenCalledWith('robots.txt', expect.anything());
    });

    it('should log info with file count when copying', () => {
        vi.mocked(fs.existsSync).mockReturnValue(true);
        vi.mocked(fs.readdirSync).mockReturnValue(['file.txt'] as any);
        vi.mocked(fs.statSync).mockReturnValue({isDirectory: () => false} as any);
        vi.mocked(fs.readFileSync).mockReturnValue(Buffer.from(''));

        const plugin = new StaticCopyPlugin();
        plugin.apply(mockCompiler);

        expect(mockLogger.info).toHaveBeenCalledWith(
            expect.stringContaining('1 file(s) from static/ to dist/')
        );
    });

    it('should use PROCESS_ASSETS_STAGE_ADDITIONAL stage', () => {
        vi.mocked(fs.existsSync).mockReturnValue(false);

        const plugin = new StaticCopyPlugin();
        plugin.apply(mockCompiler);

        expect(mockCompilation.hooks.processAssets.tap).toHaveBeenCalledWith(
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
