import {describe, it, expect, vi} from 'vitest';
import {createBaseConfig} from '../../src';
import {ConfigOptionType} from '../../src';
import {getConfigMeta} from '../../src/core';
import PugPlugin from 'pug-plugin';

vi.mock('node:fs', () => ({
    default: {
        existsSync: () => true,
        statSync: () => ({isFile: () => true, isDirectory: () => true})
    },
    existsSync: () => true,
    statSync: () => ({isFile: () => true, isDirectory: () => true}),
    readdirSync: () => ['index.html', 'about.html']
}));

vi.mock('pug-plugin', () => ({
    default: class PugPlugin {
        apply() {
        }
    }
}));
vi.mock('html-webpack-plugin', () => ({
    default: class HtmlWebpackPlugin {
        apply() {
        }
    }
}));
vi.mock('mini-css-extract-plugin', () => ({
    default: class MiniCssExtractPlugin {
        apply() {
        }
    }
}));

const validOptions: ConfigOptionType = {
    mode: 'development',
    scripts: 'ts',
    styles: 'scss',
    appType: 'spa',
    templates: {
        type: 'pug',
        entry: 'src/index.pug'
    }
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
            styles: 'scss',
            templates: {type: 'none'}
        });
        const meta = getConfigMeta(config);
        expect(meta?.appType).toBeDefined();
    });

    it('should include plugins array', () => {
        const config = createBaseConfig(validOptions);
        expect(Array.isArray(config.plugins)).toBe(true);
    });

    describe('plugins system', () => {
        it('should include PugPlugin by default', () => {
            const config = createBaseConfig(validOptions);
            const hasPugPlugin = config.plugins?.some(p => p?.constructor.name === 'PugPlugin');
            expect(hasPugPlugin).toBe(true);
        });

        it('should include HtmlWebpackPlugin when templates.type = html', () => {
            const config = createBaseConfig({
                ...validOptions,
                templates: {
                    type: 'html',
                    entry: 'src/index.html'
                }
            });
            const hasHtmlPlugin = config.plugins?.some(p => p?.constructor.name === 'HtmlWebpackPlugin');
            expect(hasHtmlPlugin).toBe(true);
        });

        it('should NOT include template plugins when templates.type = none', () => {
            const config = createBaseConfig({
                ...validOptions,
                templates: {type: 'none'}
            });
            const hasPug = config.plugins?.some(p => p?.constructor.name === 'PugPlugin');
            const hasHtml = config.plugins?.some(p => p?.constructor.name === 'HtmlWebpackPlugin');
            expect(hasPug).toBe(false);
            expect(hasHtml).toBe(false);
        });

        it('should extend plugins via plugins.extend', () => {
            const customPlugin = {
                apply: () => {
                }
            };
            const config = createBaseConfig({
                ...validOptions,
                plugins: {
                    extend: [customPlugin]
                }
            });
            expect(config.plugins).toContain(customPlugin);
        });

        it('should override core plugins via plugins.override', () => {
            const customPlugin = {
                apply: () => {
                }
            };
            const config = createBaseConfig({
                ...validOptions,
                templates: {type: 'none'},
                plugins: {
                    override: [customPlugin]
                }
            });

            expect(config.plugins).toHaveLength(1);
            expect(config.plugins?.[0]).toBe(customPlugin);
        });
    });
});

describe('createBaseConfig - Deduplication & BuildPlugins', () => {

    it('should deduplicate plugins if the same plugin is added via extend', () => {
        const config = createBaseConfig({
            ...validOptions,
            plugins: {
                extend: [
                    new (PugPlugin as any)()
                ]
            }
        });

        const pugPlugins = config.plugins?.filter(p => p?.constructor.name === 'PugPlugin');
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
            templates: {type: 'none'},
            buildPlugins: [mockBuildPlugin]
        });

        expect(setupSpy).toHaveBeenCalledOnce();
        expect(applyBaseSpy).toHaveBeenCalledOnce();
    });

    it('should deduplicate plugins even if added inside applyBase hook', () => {
        const mockBuildPlugin = {
            name: 'duplicate-injector',
            applyBase: (config: any) => {
                config.plugins.push(new (PugPlugin as any)());
            },
        };

        const config = createBaseConfig({
            ...validOptions,
            buildPlugins: [mockBuildPlugin]
        });

        const pugPlugins = config.plugins?.filter(p => p?.constructor.name === 'PugPlugin');
        expect(pugPlugins).toHaveLength(1);
    });
});
