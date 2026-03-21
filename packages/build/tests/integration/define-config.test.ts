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

});
