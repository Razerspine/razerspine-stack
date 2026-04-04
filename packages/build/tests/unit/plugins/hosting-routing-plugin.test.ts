import {describe, it, expect, vi, beforeEach} from 'vitest';
import {HostingRoutingPlugin} from '../../../src/plugins/hosting-routing-plugin';
import * as detectHostingModule from '../../../src/hosting/detect-hosting';

vi.mock('../../../src/hosting/detect-hosting');
vi.mock('../../../src/hosting/get-redirects', () => ({
    getRedirects: (type: string) => `redirects-content-for-${type}`,
}));

describe('HostingRoutingPlugin', () => {
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
            getAsset: vi.fn(),
        };

        mockCompiler = {
            getInfrastructureLogger: vi.fn().mockReturnValue(mockLogger),
            hooks: {
                thisCompilation: {
                    tap: vi.fn((name, callback) => callback(mockCompilation)),
                },
            },
        };
    });

    it('should generate _redirects for Netlify on SPA', () => {
        vi.mocked(detectHostingModule.detectHosting).mockReturnValue('netlify');

        const plugin = new HostingRoutingPlugin({appType: 'spa'});
        plugin.apply(mockCompiler);

        expect(mockCompilation.emitAsset).toHaveBeenCalledWith(
            '_redirects',
            expect.objectContaining({_value: 'redirects-content-for-spa'})
        );
    });

    it('should NOT generate vercel.json but log info for Vercel', () => {
        vi.mocked(detectHostingModule.detectHosting).mockReturnValue('vercel');

        const plugin = new HostingRoutingPlugin({appType: 'mpa'});
        plugin.apply(mockCompiler);

        expect(mockCompilation.emitAsset).not.toHaveBeenCalledWith(
            'vercel.json',
            expect.anything()
        );

        expect(mockLogger.info).toHaveBeenCalled();
    });

    it('should create 404.html fallback for static hosting in SPA mode', () => {
        vi.mocked(detectHostingModule.detectHosting).mockReturnValue('static');

        const mockIndexHtml = `<html>SPA Content</html>`;
        mockCompilation.getAsset.mockReturnValue({
            source: {source: () => mockIndexHtml}
        });

        const plugin = new HostingRoutingPlugin({appType: 'spa'});
        plugin.apply(mockCompiler);

        expect(mockCompilation.emitAsset).toHaveBeenCalledWith(
            '404.html',
            expect.objectContaining({_value: mockIndexHtml})
        );
    });

    it('should not create 404.html for MPA on static hosting', () => {
        vi.mocked(detectHostingModule.detectHosting).mockReturnValue('static');

        const plugin = new HostingRoutingPlugin({appType: 'mpa'});
        plugin.apply(mockCompiler);

        expect(mockCompilation.emitAsset).not.toHaveBeenCalledWith(
            '404.html',
            expect.anything()
        );
    });

    it('should not emit anything if hosting is static and app is MPA', () => {
        vi.mocked(detectHostingModule.detectHosting).mockReturnValue('static');

        const plugin = new HostingRoutingPlugin({appType: 'mpa'});
        plugin.apply(mockCompiler);

        expect(mockCompilation.emitAsset).not.toHaveBeenCalled();
    });
});
