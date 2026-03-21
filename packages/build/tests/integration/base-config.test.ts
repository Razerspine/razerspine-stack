import {describe, it, expect, vi} from 'vitest';
import {createBaseConfig} from '../../src';
import {ConfigOptionType} from '../../src';
import {getConfigMeta} from '../../src/core';
import {PugTemplatesPlugin} from '../../src/plugins/pug-templates-plugin';
import {HtmlTemplatesPlugin} from '../../src/plugins/html-templates-plugin';

vi.mock('node:fs', () => ({
    default: {
        existsSync: () => true,
        statSync: () => ({isFile: () => true, isDirectory: () => true})
    },
    existsSync: () => true,
    statSync: () => ({isFile: () => true, isDirectory: () => true}),
}));

const validOptions: ConfigOptionType = {
    mode: 'development',
    scripts: 'ts',
    styles: 'scss',
    appType: 'spa'
};

describe('createBaseConfig', () => {

    it('should generate valid webpack config and set metadata', () => {
        const config = createBaseConfig(validOptions);

        expect(config.mode).toBe('development');
        expect(config.output?.clean).toBe(true);

        const meta = getConfigMeta(config);
        expect(meta?.appType).toBe('spa');
    });

    it('should apply aliases to resolve object', () => {
        const optionsWithAlias: ConfigOptionType = {
            ...validOptions,
            resolve: {alias: {'@': 'src'}}
        };
        const config = createBaseConfig(optionsWithAlias);
        expect(config.resolve?.alias).toHaveProperty('@', 'src');
    });

    it('should merge user resolve config instead of overriding', () => {
        const config = createBaseConfig({
            ...validOptions,
            resolve: {
                extensions: ['.ts'],
                alias: {'@': 'src'}
            }
        });

        expect(config.resolve?.extensions).toContain('.ts');
        expect(config.resolve?.alias).toHaveProperty('@');
    });

    it('should default to spa if appType is not provided', () => {
        const config = createBaseConfig({
            mode: 'development',
            scripts: 'ts',
            styles: 'scss'
        });

        const meta = getConfigMeta(config);
        expect(meta?.appType).toBeDefined();
    });

    it('should include plugins array', () => {
        const config = createBaseConfig(validOptions);

        expect(Array.isArray(config.plugins)).toBe(true);
    });

    describe('plugins system', () => {

        it('should include PugTemplatesPlugin by default', () => {
            const config = createBaseConfig(validOptions);

            const hasPlugin = config.plugins?.some(
                (p) => p instanceof PugTemplatesPlugin
            );

            expect(hasPlugin).toBe(true);
        });

        it('should include HtmlTemplatesPlugin when templates.type = html', () => {
            const config = createBaseConfig({
                ...validOptions,
                templates: {
                    type: 'html',
                    entry: 'src/index.html'
                }
            });

            const hasPlugin = config.plugins?.some(
                (p) => p instanceof HtmlTemplatesPlugin
            );

            expect(hasPlugin).toBe(true);
        });

        it('should NOT include template plugins when templates.type = none', () => {
            const config = createBaseConfig({
                ...validOptions,
                templates: {
                    type: 'none'
                }
            });

            const hasTemplatePlugin = config.plugins?.some(
                (p) =>
                    p instanceof PugTemplatesPlugin ||
                    p instanceof HtmlTemplatesPlugin
            );

            expect(hasTemplatePlugin).toBe(false);
        });

        it('should extend plugins via plugins.extend', () => {
            const customPlugin = {apply: vi.fn()} as any;

            const config = createBaseConfig({
                ...validOptions,
                plugins: {
                    extend: [customPlugin]
                }
            });

            expect(config.plugins).toContain(customPlugin);
        });

        it('should override plugins via plugins.override', () => {
            const customPlugin = {apply: vi.fn()} as any;

            const config = createBaseConfig({
                ...validOptions,
                plugins: {
                    override: [customPlugin]
                }
            });

            expect(config.plugins).toHaveLength(1);
            expect(config.plugins?.[0]).toBe(customPlugin);
        });

        it('should NOT include internal plugins when override is used', () => {
            const customPlugin = {apply: vi.fn()} as any;

            const config = createBaseConfig({
                ...validOptions,
                plugins: {
                    override: [customPlugin]
                }
            });

            const hasInternal = config.plugins?.some(
                (p) =>
                    p instanceof PugTemplatesPlugin ||
                    p instanceof HtmlTemplatesPlugin
            );

            expect(hasInternal).toBe(false);
        });
    });
});

describe('createBaseConfig - Deduplication & BuildPlugins', () => {

    it('should deduplicate plugins if the same plugin is added via extend', () => {
        const config = createBaseConfig({
            ...validOptions,
            templates: {
                type: 'pug',
                entry: 'src/index.pug'
            },
            plugins: {
                extend: [
                    new PugTemplatesPlugin({
                        entry: 'src/index.pug',
                        mode: 'development',
                        appType: 'spa'
                    })
                ]
            }
        });

        const pugPlugins = config.plugins?.filter(p => p instanceof PugTemplatesPlugin);
        expect(pugPlugins).toHaveLength(1);
    });

    it('should call buildPlugins lifecycle hooks: setup and applyBase', () => {
        const setupSpy = vi.fn();
        const applyBaseSpy = vi.fn();

        const mockBuildPlugin = {
            name: 'test-plugin',
            setup: setupSpy,
            applyBase: applyBaseSpy,
        };

        createBaseConfig({
            ...validOptions,
            buildPlugins: [mockBuildPlugin]
        });

        expect(setupSpy).toHaveBeenCalledOnce();
        expect(applyBaseSpy).toHaveBeenCalledOnce();
    });

    it('should deduplicate plugins even if added inside applyBase hook', () => {
        const mockBuildPlugin = {
            name: 'duplicate-injector',
            applyBase: (config: any) => {
                config.plugins.push(
                    new PugTemplatesPlugin({
                        entry: 'test',
                        mode: 'development',
                        appType: 'spa'
                    })
                );
            },
        };

        const config = createBaseConfig({
            ...validOptions,
            buildPlugins: [mockBuildPlugin]
        });

        const pugPlugins = config.plugins?.filter(p => p instanceof PugTemplatesPlugin);
        expect(pugPlugins).toHaveLength(1);
    });
});
