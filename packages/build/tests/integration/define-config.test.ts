import {describe, it, expect} from 'vitest';
import {defineConfig} from '../../src';
import {Configuration} from 'webpack';

describe('defineConfig', () => {

    it('should create development config by default', async () => {
        const configFactory = defineConfig({
            mode: 'development',
            scripts: 'js',
            styles: 'scss',
            templates: {
                type: 'none'
            }
        });

        const config = await configFactory({mode: 'development'}) as Configuration;

        expect(config.mode).toBe('development');
        expect(config.devtool).toBeDefined();
    });

    it('should create production config', async () => {
        const configFactory = defineConfig({
            mode: 'production',
            scripts: 'js',
            styles: 'scss',
            templates: {
                type: 'none'
            }
        });

        const config = await configFactory({mode: 'production'}) as Configuration;

        expect(config.mode).toBe('production');
        expect(config.optimization?.minimize).toBe(true);
    });

    it('should support dynamic config (function)', async () => {
        const configFactory = defineConfig((env) => ({
            mode: env?.mode ?? 'development',
            scripts: 'js',
            styles: 'scss',
            templates: {
                type: 'none'
            }
        }));

        const config = await configFactory({mode: 'development'}) as Configuration;

        expect(config.mode).toBe('development');
    });

    it('should support async config', async () => {
        const configFactory = defineConfig(async (env) => {
            const mode = env?.mode ?? 'development';

            return {
                mode,
                scripts: 'js',
                styles: 'scss',
                templates: {
                    type: 'none'
                }
            };
        });

        const config = await configFactory({mode: 'production'}) as Configuration;

        expect(config.mode).toBe('production');
    });

    it('should fallback to options.mode if env.mode is not provided', async () => {
        const configFactory = defineConfig({
            mode: 'production',
            scripts: 'js',
            styles: 'scss',
            templates: {
                type: 'none'
            }
        });

        const config = await configFactory() as Configuration;

        expect(config.mode).toBe('production');
    });

    it('should merge presets into buildPlugins', async () => {
        const mockPreset = {
            name: 'test-preset',
            applyBase(config: Configuration) {
                config.name = 'preset-applied';
            },
        };

        const configFactory = defineConfig({
            mode: 'development',
            scripts: 'js',
            styles: 'scss',
            templates: {
                type: 'none'
            },
            presets: [mockPreset],
        });

        const config = await configFactory({mode: 'development'}) as Configuration;

        expect(config.name).toBe('preset-applied');
    });

    it('should apply devServer overrides in development mode', async () => {
        const configFactory = defineConfig({
            mode: 'development',
            scripts: 'js',
            styles: 'scss',
            templates: {
                type: 'none'
            },
            devServer: {
                port: 3001,
                proxy: [
                    {
                        context: ['/api'],
                        target: 'http://localhost:4000'
                    }
                ],
            },
        });

        const config = await configFactory() as Configuration & { devServer?: any };

        expect(config.devServer).toBeDefined();
        expect(config.devServer?.port).toBe(3001);
        expect(config.devServer?.proxy).toEqual([
            {context: ['/api'], target: 'http://localhost:4000'}
        ]);
    });

    it('should apply prod overrides in production mode', async () => {
        const configFactory = defineConfig({
            mode: 'production',
            scripts: 'js',
            styles: 'scss',
            templates: {
                type: 'none'
            },
            prod: {
                optimization: {
                    minimize: false
                },
                performance: {
                    hints: 'error'
                },
            },
        });

        const config = await configFactory() as Configuration;

        expect(config.optimization?.minimize).toBe(false);

        const performance = config.performance as Exclude<Configuration['performance'], false>;
        expect(performance?.hints).toBe('error');
    });

    it('should ignore prod overrides in development mode', async () => {
        const configFactory = defineConfig({
            mode: 'development',
            scripts: 'js',
            styles: 'scss',
            templates: {
                type: 'none'
            },
            prod: {
                performance: {
                    hints: 'error'
                },
            },
        });

        const config = await configFactory() as Configuration;

        const performance = config.performance as Exclude<Configuration['performance'], false>;
        expect(performance?.hints).not.toBe('error');
    });

    it('should ignore devServer overrides in production mode', async () => {
        const configFactory = defineConfig({
            mode: 'production',
            scripts: 'js',
            styles: 'scss',
            templates: {
                type: 'none'
            },
            devServer: {
                port: 3001,
            },
        });

        const config = await configFactory() as Configuration & { devServer?: any };

        expect(config.devServer?.port).toBeUndefined();
    });

});
