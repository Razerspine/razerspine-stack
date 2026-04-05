/**
 * @module html-rule
 * @description Webpack rule for processing `.html` files when `templates.type` is `'html'`.
 *
 * Provides dual-mode handling via `oneOf`:
 *
 * 1. **Compile mode** (`issuer: JS/TS`) —
 *    When a `.html` file is imported from a JS/TS/JSX/TSX module, `ejs-loader` compiles it
 *    into a callable JavaScript function. This is the foundation of the component architecture:
 *    each page/component has its own `.html` template that is imported and rendered at runtime.
 *
 *    @example
 *    ```ts
 *    // home.page.ts
 *    import '@pages/home/style.scss';
 *    import template from '@pages/home/home.html';
 *
 *    export class HomePage extends BaseComponent<HomeState> {
 *      public render() {
 *        this.container.innerHTML = template();
 *      }
 *    }
 *    ```
 *
 * 2. **Render mode** (no issuer / fallback) —
 *    When a `.html` file is processed outside a JS/TS import context (e.g. read by
 *    `html-webpack-plugin` as a template), `html-loader` handles it. This allows Webpack to
 *    resolve and emit static assets referenced via `<img src>` and `<link href>` tags.
 *
 * ⚠️ Requires `ejs-loader` and `html-loader` to be installed:
 * ```bash
 * npm install -D ejs-loader html-loader
 * ```
 */
export function htmlRule() {
    return {
        test: /\.html$/,
        oneOf: [
            {
                /**
                 * Compile mode: `.html` imported from a JS/TS module.
                 *
                 * `ejs-loader` compiles the HTML into a JavaScript function.
                 * Call the returned function to get the rendered HTML string: `template()`.
                 *
                 * `esModule: false` ensures CJS-compatible output so that
                 * `import template from './home.html'` works without `.default` unwrapping.
                 */
                issuer: /\.(js|ts|tsx|jsx)$/,
                loader: 'ejs-loader',
                options: {
                    esModule: false,
                },
            },
            {
                /**
                 * Render mode: `.html` processed as a template by `html-webpack-plugin`.
                 *
                 * `html-loader` parses the HTML and resolves static asset references
                 * (`<img src>`, `<link href>`) so Webpack can emit them correctly.
                 *
                 * The `sources.list` spread (`'...'`) preserves the default source list
                 * (e.g. `<img src>`, `<source srcset>`) and appends additional tag/attribute
                 * pairs on top of it.
                 */
                loader: 'html-loader',
                options: {
                    sources: {
                        list: [
                            '...',
                            {
                                tag: 'img',
                                attribute: 'src',
                                type: 'src',
                            },
                            {
                                tag: 'link',
                                attribute: 'href',
                                type: 'src',
                            },
                        ],
                    },
                },
            },
        ],
    };
}
