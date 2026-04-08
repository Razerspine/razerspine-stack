import * as fs from 'node:fs';
import * as path from 'path';
import {Compiler, Compilation, Configuration, sources, WebpackPluginInstance} from 'webpack';
import {BuildPluginType} from '../types';
import {markPlugin} from '../utils';

/**
 * Recursively collects all file paths inside a directory.
 */
async function collectFiles(dir: string): Promise<string[]> {
    const result: string[] = [];
    const entries = await fs.promises.readdir(dir);

    for (const entry of entries) {
        const fullPath = path.join(dir, entry);
        const stat = await fs.promises.stat(fullPath);

        if (stat.isDirectory()) {
            result.push(...(await collectFiles(fullPath)));
        } else {
            result.push(fullPath);
        }
    }

    return result;
}

/**
 * @class StaticCopyPlugin
 * @description Webpack plugin that copies all files from the project's `static/` directory
 * into the output directory, preserving the directory structure.
 *
 * Follows "Convention over Configuration" — no configuration required.
 * If `static/` exists in `compiler.context` (the project root), its entire contents are
 * emitted as Webpack assets. If the directory does not exist, the plugin silently skips.
 *
 * Lifecycle:
 * Uses `PROCESS_ASSETS_STAGE_ADDITIONAL` — runs early in the asset processing pipeline
 * so the copied files are available to subsequent stages (e.g. `PROCESS_ASSETS_STAGE_SUMMARIZE`).
 *
 * Watch mode:
 * Registers `static/` as a context dependency so Webpack Dev Server / `--watch` rebuilds
 * whenever files inside the directory are added, removed, or changed.
 */
export class StaticCopyPlugin {
    apply(compiler: Compiler) {
        const logger = compiler.getInfrastructureLogger('@razerspine/build');

        compiler.hooks.thisCompilation.tap('StaticCopyPlugin', (compilation: Compilation) => {
            compilation.hooks.processAssets.tapPromise(
                {
                    name: 'StaticCopyPlugin',
                    stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
                },
                async () => {
                    const staticDir = path.join(compiler.context, 'static');

                    // Register as a context dependency so watch mode detects changes
                    // even when the directory does not yet exist.
                    compilation.contextDependencies.add(staticDir);

                    try {
                        await fs.promises.access(staticDir);
                    } catch {
                        return;
                    }

                    const files = await collectFiles(staticDir);

                    if (files.length === 0) {
                        return;
                    }

                    logger.info(`📦 Copying ${files.length} file(s) from static/ to dist/...`);

                    await Promise.all(
                        files.map(async (filePath) => {
                            const relPath = path.relative(staticDir, filePath).replace(/\\/g, '/');
                            const content = await fs.promises.readFile(filePath);
                            compilation.emitAsset(relPath, new sources.RawSource(content));
                        })
                    );
                }
            );
        });
    }
}

/**
 * @function createStaticCopyPlugin
 * @description Internal build plugin factory that wires up {@link StaticCopyPlugin}.
 *
 * Returns a {@link BuildPluginType} whose `applyBase` hook pushes a tagged
 * {@link StaticCopyPlugin} instance into `config.plugins`. The instance is tagged
 * via {@link markPlugin} so `dedupePlugins` can identify and remove exact duplicates
 * (e.g. if the user adds another instance via `plugins.extend`).
 *
 * Registered in `createBaseConfig` as an always-on internal plugin — active in both
 * development and production builds regardless of the template engine in use.
 */
export function createStaticCopyPlugin(): BuildPluginType {
    return {
        name: 'static-copy',

        applyBase(config: Configuration): void {
            config.plugins = config.plugins ?? [];
            config.plugins.push(
                markPlugin(new StaticCopyPlugin() as unknown as WebpackPluginInstance)
            );
        },
    };
}
