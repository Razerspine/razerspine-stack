import {defineConfig} from 'tsup';

const pkg = require('../../package.json');

/**
 * Production build config for CLI package.
 *
 * Goals:
 * - Dual output (CJS + ESM)
 * - Keep CLI executable (shebang)
 * - Fast builds
 * - Clean output
 */
export default defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: false,
    clean: true,
    /**
     * Required for CLI tools
     */
    banner: {
        js: '#!/usr/bin/env node'
    },
    /**
     * Target modern Node.js (aligned with engines)
     */
    target: 'node18',
    /**
     * Keep node_modules external
     */
    external: [
        'fs',
        'path',
        'inquirer',
        'ora',
        'commander',
        'fs-extra'
    ],
    outExtension({format}) {
        return {
            js: format === 'cjs' ? '.cjs' : '.mjs'
        };
    },
    define: {
        __VERSION__: JSON.stringify(pkg.version)
    }
});
