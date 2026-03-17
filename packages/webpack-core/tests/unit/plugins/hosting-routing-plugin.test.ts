import {describe, it, expect, vi, beforeEach} from 'vitest';
import {HostingRoutingPlugin} from '../../../src/plugins/hosting-routing-plugin';
import * as detectHostingModule from '../../../src/hosting/detect-hosting';

vi.mock('../../../src/hosting/detect-hosting');
vi.mock('../../../src/hosting/get-redirects', () => ({
    getRedirects: (type: string) => `redirects-content-for-${type}`,
}));
vi.mock('../../../src/hosting/get-vercel-config', () => ({
    getVercelConfig: (type: string) => `vercel-json-for-${type}`,
}));

describe('HostingRoutingPlugin', () => {
    let mockCompiler: any;
    let mockCompilation: any;

    beforeEach(() => {
        vi.clearAllMocks();

        mockCompilation = {
            hooks: {
                processAssets: {
                    tap: vi.fn((options, callback) => callback()),
                },
            },
            emitAsset: vi.fn(),
            getAsset: vi.fn(),
            getInfrastructureLogger: vi.fn().mockReturnValue({info: vi.fn()}),
        };

        mockCompiler = {
            getInfrastructureLogger: vi.fn().mockReturnValue({info: vi.fn()}),
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

    it('should generate vercel.json for Vercel on MPA', () => {
        vi.mocked(detectHostingModule.detectHosting).mockReturnValue('vercel');

        const plugin = new HostingRoutingPlugin({appType: 'mpa'});
        plugin.apply(mockCompiler);

        expect(mockCompilation.emitAsset).toHaveBeenCalledWith(
            'vercel.json',
            expect.objectContaining({_value: 'vercel-json-for-mpa'})
        );
    });

    it('should create 404.html fallback for GitHub Pages in SPA mode', () => {
        vi.mocked(detectHostingModule.detectHosting).mockReturnValue('github');

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

    it('should not create 404.html for MPA on GitHub Pages', () => {
        vi.mocked(detectHostingModule.detectHosting).mockReturnValue('github');

        const plugin = new HostingRoutingPlugin({appType: 'mpa'});
        plugin.apply(mockCompiler);

        expect(mockCompilation.emitAsset).not.toHaveBeenCalledWith('404.html', expect.anything());
    });

    it('should not emit anything if hosting is unknown and app is MPA', () => {
        vi.mocked(detectHostingModule.detectHosting).mockReturnValue('static');

        const plugin = new HostingRoutingPlugin({appType: 'mpa'});
        plugin.apply(mockCompiler);

        expect(mockCompilation.emitAsset).not.toHaveBeenCalled();
    });
});
