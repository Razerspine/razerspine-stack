import {defineConfig} from 'tsup';

export default defineConfig({
    entry: {
        index: 'src/index.ts',
        core: 'src/core/index.ts',
        http: 'src/http/index.ts',
        platform: 'src/platform/index.ts',
        reactivity: 'src/reactivity/index.ts',
        router: 'src/router/index.ts',
        utils: 'src/utils/index.ts',
        view: 'src/view/index.ts',
        bindings: 'src/view/bindings/index.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    minify: false,
    treeshake: true,
    shims: false,
});
