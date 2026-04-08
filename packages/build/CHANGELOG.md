# Changelog

All notable changes to this project will be documented in this file.

---

## [1.0.2] - 2026-04-08

### Added

#### `devServer` and `prod` overrides in `defineConfig`

Users can now configure the Dev Server and production Webpack options directly inside `defineConfig`
without reaching for `buildPlugins`.

**`devServer`** — passed to `createDevConfig` as DevServer overrides. Merged on top of the default
devServer settings. Only applied in `development` mode.

```ts
defineConfig({
  scripts: 'ts',
  styles: 'scss',
  devServer: {
    port: 3000,
    proxy: {'/api': 'http://localhost:4000'},
  },
})
```

**`prod`** — passed to `createProdConfig` as Webpack overrides. Merged last, so these settings take
priority over all internal production defaults. Only applied in `production` mode.

```ts
defineConfig({
  scripts: 'ts',
  styles: 'scss',
  prod: {
    optimization: {minimize: false},
    performance: {hints: 'warning'},
  },
})
```

Both fields are optional and fully type-safe. For complex lifecycle scenarios, `buildPlugins`
remains the recommended approach.

---

#### Template Data Support (`templates.data`)

Both `PugTemplatesPlugin` and `HtmlTemplatesPlugin` now accept a `data` option
for passing global variables into all templates at compile time.

**`PugTemplatesPlugin`** — passes data as a top-level `data` option of `html-bundler-plugin`
(which `pug-plugin` extends). Supports two formats:

- `object` — static data, available immediately (requires webpack restart on change)
- `string` — path to a JSON or JS file, supports HMR via webpack watch

```ts
defineConfig({
  templates: {
    type: 'pug',
    entry: 'src/views/pages',
    data: {
      siteName: 'My App',
      version: process.env.npm_package_version,
    },
    // or HMR-friendly:
    // data: './src/data/site.json',
  }
});
```

Usage in Pug template:

```pug
title= siteName
p Version: #{version}
```

**`HtmlTemplatesPlugin`** — injects data via `templateParameters` as a **function**
(not a plain object) to safely merge user data with default `htmlWebpackPlugin` parameters.
Passing a plain object would overwrite defaults — a known `html-webpack-plugin` gotcha.

```ts
defineConfig({
  templates: {
    type: 'html',
    entry: 'src/app/index.html',
    data: {
      siteName: 'My App',
      version: process.env.npm_package_version,
    }
  }
});
```

Usage in HTML template (EJS syntax):

```html
<title><%= siteName %></title>
<meta name="version" content="<%= version %>">
```

> Note: `html-webpack-plugin` does not support a `string` path for data (unlike `pug-plugin`).
> The `data` option for `html` templates accepts only an `object`.

---

#### Full HTML component architecture (`type: 'html'`)

`templates.type: 'html'` has been completely reworked into a proper component-based architecture,
on par with the existing `type: 'pug'` pipeline.

**`htmlRule`** — new dual-mode Webpack rule for `.html` files (injected automatically for `type: 'html'`):

- **Compile mode** (`issuer: JS/TS`): `.html` files imported from JS/TS are compiled by `ejs-loader`
  into callable JavaScript functions. Enables the component pattern:

  ```ts
  // home.page.ts
  import './style.scss';
  import template from './home.html';

  export class HomePage extends BaseComponent<HomeState> {
    public render() {
      this.container.innerHTML = template();
    }
  }
  ```

- **Render mode** (fallback): `.html` files used as `html-webpack-plugin` templates are processed
  by `html-loader`, which resolves static assets (`<img src>`, `<link href>`).

**`htmlStylesRule`** — new CSS processing rule for `type: 'html'`, replacing `stylesRule` in this mode.
Uses the correct extraction strategy for a standard JS/TS entry pipeline:

- **Development**: `style-loader` injects CSS via `<style>` tags at runtime (HMR-friendly).
- **Production**: `MiniCssExtractPlugin.loader` extracts CSS into a separate `.css` file.

**`templates.scriptEntry`** — new option in `ConfigOptionType.templates`:

```ts
defineConfig({
  appType: 'spa',
  scripts: 'ts',
  styles: 'scss',
  templates: {
    type: 'html',
    entry: 'src/app/index.html',
    scriptEntry: 'src/app/main.ts',  // optional, see defaults below
  },
});
```

The `scriptEntry` is registered as the Webpack `entry` by `HtmlTemplatesPlugin`.
This is required because `html-webpack-plugin` only generates HTML — Webpack still needs
an explicit JS/TS entry to build the bundle that gets injected into the output.

Defaults (when `scriptEntry` is omitted):

- `scripts: 'ts'` → `src/app/main.ts`
- `scripts: 'js'` → `src/app/main.js`

If the resolved file does not exist on disk, a clear actionable error is thrown before the build starts.

**`MiniCssExtractPlugin`** — registered automatically by `HtmlTemplatesPlugin` in production mode.
In development, `style-loader` handles injection — no plugin registration needed.

**New required peer dependencies** for `type: 'html'`:

```bash
npm install -D html-webpack-plugin ejs-loader html-loader mini-css-extract-plugin style-loader
```

---

### Fixed

#### Lazy Peer Dependency Resolution

Both `PugTemplatesPlugin` and `HtmlTemplatesPlugin` previously imported their
peer dependencies (`pug-plugin`, `html-webpack-plugin`) at the module level via static `import`.
This caused build failures when switching template engines — e.g. a project using
`templates.type: 'html'` would crash on startup because `pug-plugin` was not installed,
even though it was never used.

Both plugins now use **lazy `require()`** inside `apply()` with a clear actionable error
if the dependency is missing:

```
[build] Missing peer dependency: `pug-plugin`.
Install it with:

  npm install -D pug-plugin

Required when using `templates.type: "pug"`.
```

Both resolvers also handle ESM/CJS interop by unwrapping `.default` if present,
ensuring consistent behavior between the production environment and vitest's module system.

`HtmlTemplatesPlugin` extends this pattern to `mini-css-extract-plugin` as well —
it is resolved lazily only in production mode.

---

#### Hosting Routing Plugin

- **Vercel**: removed incorrect emission of `vercel.json` into `dist/`.
  Vercel reads `vercel.json` from the repository root before the build starts —
  placing it in `dist/` has no effect on routing and caused confusion.
  The plugin now logs a reminder instead:
  ```
  📦 Vercel detected (SPA mode). Ensure vercel.json is present in your project root...
  ```

- **Lifecycle stage**: changed from `PROCESS_ASSETS_STAGE_ADDITIONS` →
  `PROCESS_ASSETS_STAGE_SUMMARIZE`. This ensures `index.html` already exists in
  the compilation when the SPA `404.html` fallback is generated. Previously,
  the fallback could silently fail if `index.html` was not yet emitted.

- **SPA fallback warning**: if `index.html` is not found in compilation assets during
  SPA mode, the plugin now emits a `logger.warn` with a clear explanation instead of
  silently skipping.

- **`GITHUB_ACTIONS` detection removed**: `GITHUB_ACTIONS=true` indicates a CI runner,
  not a GitHub Pages deployment. There is no reliable env var for GitHub Pages at build time.
  Such projects now correctly fall through to `'static'`, and the SPA `404.html` fallback
  is still generated — which is exactly what GitHub Pages needs.

- **`'github'` removed from `HostingType`**: no longer a valid hosting target
  since it cannot be reliably detected. Replaced by `'static'` fallback.

---

#### `normalizeOptions` — type-aware default `templates.entry` for SPA

Previously the SPA default for `templates.entry` was always `src/views/app.pug` regardless
of `templates.type`. This meant a project using `type: 'html'` without an explicit `entry`
would silently receive a `.pug` path — which could pass validation if the file happened to
exist from a previous `pug` setup, leading to a confusing mismatch.

Default is now resolved per template type:

| `templates.type` | `appType: 'spa'` default | `appType: 'mpa'` default |
|:-----------------|--------------------------|:-------------------------|
| `pug`            | `src/views/app.pug`      | `src/views/pages`        |
| `html`           | `src/app/index.html`     | `src/views/pages`        |

---

#### `HtmlTemplatesPlugin` — safe `compiler.options.entry` mutation

Previously `compiler.options.entry` was spread unconditionally via `...((entry as object) ?? {})`.
Webpack `entry` can legally be a `string`, `string[]`, `object`, or `function` — spreading a
non-object value produces incorrect results or throws a `TypeError` at runtime.

The plugin now checks the type before spreading:

- **plain object** → spread and merge `main` entry on top (existing entries preserved)
- **any other format** (string, array, function) → replace entirely with `{ main: { import: [scriptEntry] } }`

This does not affect `type: 'pug'` at all — `HtmlTemplatesPlugin` is never instantiated in
that pipeline.

---

#### Architectural Refactoring: `PugTemplatesPlugin` and `HtmlTemplatesPlugin` as `BuildPluginType`

**Problem (Legacy Architecture)**

Previously, internal template plugins were standard Webpack plugins using the `apply(compiler)` method. They acted as "
black boxes," meaning their internal logic remained hidden from the `config.plugins` array until Webpack was fully
initialized. This led to several issues:

- **Deduplication failure:** `dedupePlugins` could not detect internal instances of `PugPlugin` or `HtmlWebpackPlugin`
  if a user added their own via `plugins.extend`.
- **Override limitations:** `plugins.override` could not target or replace plugins hidden inside these internal classes.
- **Hidden dependencies:** Plugins like `MiniCssExtractPlugin` were instantiated inside `apply(compiler)`, making them
  invisible for external configuration.
- **Entry point conflicts:** Modifying `compiler.options.entry` inside `apply()` occurred too late, causing collisions
  with user-defined entries or `buildPlugin.applyBase` hooks.

**Solution**

`PugTemplatesPlugin` and `HtmlTemplatesPlugin` are no longer standard Webpack plugins. They have been replaced by *
*factory functions** (`createPugTemplatesPlugin` / `createHtmlTemplatesPlugin`) that return a **`BuildPluginType`**
object featuring the `applyBase(config)` hook.

**New Execution Flow in `createBaseConfig`:**

1. The system resolves `templates.type` and initializes the corresponding `BuildPluginType`.
2. These are stored in `internalBuildPlugins` and executed **before** user-supplied `buildPlugins`.
3. The `applyBase(config)` hook **declaratively** pushes Webpack plugins and entry points into the `Configuration`
   object.
4. `dedupePlugins` and `dedupeRules` are executed at the very end, ensuring a clean, conflict-free final configuration.

**Specific Plugin Changes**

**`createPugTemplatesPlugin` (`applyBase`):**

- Declaratively pushes `PugPlugin` into `config.plugins`, making it available for `dedupePlugins` and
  `plugins.override`.
- **Fixed MPA Path Flattening:** Changed logic from `let [name] = chunk.name.split('/')` to preserve full directory
  structures (e.g., `shop/product` now correctly results in `shop/product.html`).
- Maintained the legacy mapping of `home` to `index.html` for the root page.

**`createHtmlTemplatesPlugin` (`applyBase`):**

- Pushes `MiniCssExtractPlugin` (in production mode) directly into `config.plugins`.
- Pushes one or more `HtmlWebpackPlugin` instances into `config.plugins` where they are visible for deduplication.
- **Entry Point Safety:** Now writes to `config.entry.main` **only if it is not already defined**, preventing it from
  overwriting custom entry points or those defined via other `buildPlugin.applyBase` hooks.

#### `HtmlTemplatesPlugin` MPA — recursive directory scan for nested HTML pages

Previously, `createHtmlTemplatesPlugin` located MPA page files using a flat
`fs.readdirSync(entry).filter(f => f.endsWith('.html'))`, reading only the top level of the
entry directory. Any HTML file nested inside a sub-directory (e.g.
`src/views/pages/about/index.html`, `src/views/pages/shop/product.html`) was silently ignored
and never included in the Webpack build.

The MPA scan now uses `getHtmlFiles(entry)` (recursive deep scan introduced in `src/utils/`),
which collects `.html` files at every nesting level. Output filenames are computed as paths
relative to the entry root, preserving the directory structure:

```
src/views/pages/
  index.html           → dist/index.html
  about/index.html     → dist/about/index.html
  shop/product.html    → dist/shop/product.html
```

Path separators are normalised to `/` so the behaviour is consistent on Windows as well.

---

#### `plugins.override` — internal build plugins no longer bypass the override

Previously, when a user passed `plugins.override`, the initial `config.plugins` array was
correctly replaced with the user-supplied list. However, internal `BuildPluginType` instances
(`createPugTemplatesPlugin`, `createHtmlTemplatesPlugin`) still ran their `applyBase(config)`
hook afterward, pushing `PugPlugin`, `HtmlWebpackPlugin`, and `MiniCssExtractPlugin` directly
into `config.plugins`. This meant `override: []` never produced an empty plugins array —
internal template plugins would always sneak back in, violating the principle of least surprise.

`createBaseConfig` now skips `applyBase` for all `internalBuildPlugins` when `plugins.override`
is set. User-supplied `buildPlugins` are unaffected and still run their `applyBase` regardless.

```ts
// Before: internal plugins always called applyBase — override was partial at best
// After: override: [] produces exactly what the user expects
defineConfig({
  plugins: { override: [new DefinePlugin({ VERSION: '"1.0.0"' })] },
});
// config.plugins === [DefinePlugin] — no PugPlugin injected behind the scenes
```

---

#### `dedupeRules` — rules with same `test` but different loaders are no longer falsely deduplicated

`getRuleKey` previously identified rules by their matching conditions only (`test`, `include`,
`exclude`, `issuer`, `resourceQuery`). Two rules with the same `test` pattern but entirely
different loaders — e.g. a `?raw` variant and the standard processing pipeline, or two
post-processors for the same file type — were treated as the same rule, with the first one
silently dropped (last-wins).

The key now also covers `use`, `loader`, and `type`. Rules are only considered duplicates when
both their matching conditions **and** their loader actions are identical.

To replace an internal rule entirely, use `rules.override` (the intended API for full
replacement).

---

#### `serialize` — cross-realm `RegExp` detection

`serialize` in `dedupe-rules.ts` previously used `value instanceof RegExp` to detect regular
expressions. In environments where the `RegExp` constructor differs across module realms (e.g.
complex `npm link` setups or monorepo hoisting edge cases), `instanceof` can return `false` for
a value that is a valid `RegExp`, causing the serializer to fall through to the object branch
and produce an incorrect key.

The check is now `Object.prototype.toString.call(value) === '[object RegExp]'`, which is
realm-safe and returns the correct tag for any `RegExp` instance regardless of its origin.

---

#### `validateOptions` — `scriptEntry` guard for `type: 'pug'` and `type: 'none'`

`templates.scriptEntry` is only meaningful for `type: 'html'`. If provided for `type: 'pug'`
or `type: 'none'`, the value would be silently ignored — `pug-plugin` manages its own entry
system and does not read `scriptEntry`. This could mislead developers expecting it to have an
effect.

A validation error is now thrown immediately:

```
[build] templates.scriptEntry is only supported when templates.type is "html".
Current templates.type is "pug". Remove scriptEntry from your config.
```

---

#### `dedupePlugins` — Symbol-based deduplication (replaces `constructor.name` heuristic)

**Problem**

The previous implementation keyed plugin instances on `constructor.name` combined with an
optional `filename` field read from `(plugin as any).userOptions || (plugin as any).options`.
This had two critical flaws:

- **False positives for multi-instance plugins.** Many standard Webpack plugins
  (`DefinePlugin`, `ProvidePlugin`, `CopyWebpackPlugin`, etc.) are legitimately used more
  than once with different arguments. Because they share the same `constructor.name` and have
  no `filename` field, all instances after the first were silently dropped.

- **Fragile duck-typing.** Accessing undocumented private properties via `(plugin as any)`
  is inherently unstable — plugin authors may rename internal fields at any time, which would
  silently break deduplication for those plugins.

**Solution**

`dedupePlugins` now uses a **Symbol-based tagging** strategy via the new `markPlugin` helper.

Internal plugin instances are tagged with a unique `Symbol` (stored in a side-channel
`WeakMap`) immediately after construction. `dedupePlugins` checks only for this tag:

- **Tagged plugins** (internal framework instances): deduplicated precisely — only the first
  occurrence of each unique Symbol is kept.
- **Untagged plugins** (user-supplied / third-party): always kept as-is, regardless of their
  `constructor.name` or how many times they appear.

The `WeakMap` storage means there is no memory leak — entries are garbage-collected along
with their plugin instances.

All internal plugin instances (`PugPlugin`, `HtmlWebpackPlugin`, `MiniCssExtractPlugin`)
are now tagged with `markPlugin` before being pushed into `config.plugins`.

```ts
// Before (fragile):
const key = name; // constructor.name — drops all duplicate DefinePlugin instances

// After (precise):
const pugPlugin = markPlugin(new PugPlugin({ ... }));
config.plugins.push(pugPlugin);
// dedupePlugins keeps the first occurrence, ignores untagged user plugins entirely
```

---

#### `createBaseConfig` — Webpack-first entry for `type: 'html'` and `type: 'none'`

**Problem**

The previous implementation did not set `config.entry` at all for `templateType: 'none'`,
causing Webpack to fall back to its default entry (`./src/index.js`). This silently broke
React/Vue setups where `templates.type: 'none'` is the expected mode and the actual entry
(e.g. `src/app/main.tsx`) was resolved in `normalizeOptions` but never registered.

**Solution**

`createBaseConfig` now sets `config.entry.main` from `normalized.templates.scriptEntry`
**before** any `buildPlugin.applyBase` hook runs, but only for `templates.type: 'html'`
and `templates.type: 'none'`:

```ts
// Set only for 'html' and 'none' — NOT for 'pug'
config.entry = {
    main: {
        import: [normalized.templates.scriptEntry],
    },
};
```

`templates.type: 'pug'` is intentionally excluded because `pug-plugin`
(html-bundler-webpack-plugin) manages its own internal entry system from `.pug` files.
Injecting an external `entry.main` alongside `pug-plugin` causes a "Module not found"
error when `src/app/main.js` does not exist — which is the expected state for
Pug-driven projects where scripts are embedded inside `.pug` templates.

Per-type behavior after this change:

| `templates.type` | `entry.main` set by         | Template plugin behaviour                                               |
|:-----------------|-----------------------------|-------------------------------------------------------------------------|
| `none`           | `createBaseConfig`          | No template plugin; `entry.main` is the only entry.                     |
| `html`           | `createBaseConfig`          | `HtmlTemplatesPlugin.applyBase` guard skips `entry.main` — already set. |
| `pug`            | not set                     | `PugPlugin` registers its own entries from `.pug` files.                |

`createHtmlTemplatesPlugin.applyBase` retains its existing safety guard and will not
overwrite `entry.main` if it is already present, so the behavior for `type: 'html'` is
unchanged from the user's perspective.

---

### Changed

- `HostingType` union: removed `'github'`, now `'netlify' | 'vercel' | 'cloudflare' | 'static'`
- `ConfigOptionType.templates.data` type extended to `Record<string, unknown> | string`
  (string path supported for `pug` only; `html` accepts object only)
- `NormalizedCoreOptions.templates.data` type updated accordingly
- `ConfigOptionType.templates.scriptEntry` added (optional, only applies to `type: 'html'`)
- `NormalizedCoreOptions.templates.scriptEntry` added (resolved absolute path)
- `stylesRule` is no longer used for `type: 'html'` — replaced by `htmlStylesRule`
- `rules/index.ts` exports `htmlRule` and `htmlStylesRule`
- `normalizeOptions` SPA default for `templates.entry` is now type-aware (see Fixed above)
- `dedupePlugins` strategy changed from `constructor.name + filename duck-typing` to Symbol-based
  tagging via `markPlugin`; untagged (user-supplied) plugins are never removed
- `createBaseConfig` now sets `config.entry.main` from `normalized.templates.scriptEntry`
  for `type: 'html'` and `type: 'none'` before any `buildPlugin.applyBase` hook runs;
  `type: 'pug'` is intentionally excluded — `pug-plugin` manages its own entry system
- `markPlugin` helper exported from `utils/dedupe-plugins` for use in internal plugin factories
- `getDefaultScriptEntry(scripts)` helper extracted from `normalize-options.ts` (exported) and
  `validate-options.ts` (imported); removes duplicated `scripts === 'ts' ? ... : ...` ternary
  that previously lived in both files independently

---

## [1.0.1] - 2026-03-31

### Changed

- Updated repository links in `package.json` following the monorepo renaming.

### Fixed

- Fix and update `README.md`.

---

## [1.0.0] - 2026-03-20

### 🚨 Breaking Changes

- Package renamed from `@razerspine/webpack-core` → `@razerspine/build`
- The internal architecture has been completely redesigned (breaking changes included)

---

### Major Features

#### New Architecture

Complete internal restructuring with clear modular boundaries:

```text
core/ → config creation (base/dev/prod)
options/ → validation, normalization, resolving
rules/ → webpack module rules (scripts, styles, assets, pug)
plugins/ → custom webpack plugins
hosting/ → hosting detection + routing generation
presets/ → (Beta) built-in framework setups (React)
types/ → strongly typed public API
utils/ → shared helpers
```

- Improved maintainability and scalability
- Clear separation of concerns
- Easier extension for future features

---

#### Options Pipeline (validate → normalize → resolve)

New unified options processing flow:

```ts
resolveOptions(options)
```

- `validateOptions` - strict validation
- `normalizeOptions` - defaults + shaping
- `resolveOptions` - single entry point

---

#### Config Metadata System

Introduced internal metadata layer using WeakMap:

```ts
setConfigMeta(config, meta)
getConfigMeta(config)
```

- Enables context-aware config behavior
- Used internally for SPA/MPA handling
- No mutation of webpack config object

---

#### defineConfig Helper

Introduced a new `defineConfig` helper for creating Webpack configurations.

Provides a clean, scalable, and flexible way to define build setup
without manually composing base/dev/prod configs.

##### Features:

- Single entry point for configuration
- Automatic mode-based resolution (`development` / `production`)
- Supports static, dynamic, and async config
- Built-in `presets` support (mapped to `buildPlugins`)
- Strong typing and improved developer experience
- Fully compatible with Build Plugins system

##### Supported formats:

```ts
// Static config
export default defineConfig({
  mode: 'development',
  scripts: 'ts',
  styles: 'scss'
});

// Dynamic config
export default defineConfig(({mode}) => ({
  mode,
  scripts: 'ts',
  styles: 'scss'
}));

// Async config

export default defineConfig(async ({mode}) => {
  return {
    mode,
    scripts: 'ts',
    styles: 'scss'
  };
});

// Presets support:
import {defineConfig, reactPreset} from '@razerspine/build';

export default defineConfig({
  mode: 'development',
  scripts: 'ts',
  styles: 'scss',
  presets: [
    reactPreset()
  ]
});
```

##### Notes:

Internally composes:

- `createBaseConfig`
- `createDevConfig`
- `createProdConfig`
- `presets` is syntactic sugar over `buildPlugins`
- No hidden behavior — all logic delegated to core modules

---

#### Template Engine System

Introduced flexible template engine support:

- `templates.type` option:
  - `pug` (default) → uses `PugTemplatesPlugin`
  - `html` → uses `HtmlTemplatesPlugin`
  - `none` → disables template handling

- New plugin:
  - `HtmlTemplatesPlugin` (wrapper around html-webpack-plugin)

- Conditional rule injection:
  - `pugRule` is only applied when `templates.type === 'pug'`

---

#### React Preset (Beta)

Introduced experimental **React preset** built on top of the Build Plugins system.

Provides a near Vite-like developer experience for React applications.

##### Features:

- Babel-based pipeline (no `ts-loader`)
- React Fast Refresh (development only)
- Automatic JSX runtime (`react/jsx-runtime`)
- TypeScript support (`.ts` / `.tsx`)
- Zero-config entry (`src/main.tsx` or `src/main.jsx`)
- Seamless integration with existing rules/plugins system
- Safe rule & plugin deduplication

##### Usage:

```ts
import {createBaseConfig, reactPreset} from '@razerspine/build';

createBaseConfig({
  mode: 'development',
  scripts: 'ts',
  styles: 'scss',
  templates: {
    type: 'none'
  },
  buildPlugins: [
    reactPreset()
  ]
});
```

##### Required dependencies (must be installed in the user project):

```bash
npm install -D \
  babel-loader \
  @babel/core \
  @babel/preset-env \
  @babel/preset-react \
  @babel/preset-typescript \
  @pmmmwh/react-refresh-webpack-plugin \
  react-refresh
```

##### Notes:

- This preset is currently in beta and may evolve.
- Dependencies are not bundled inside `@razerspine/build` (by design).
- Missing dependencies will not crash the build, but may degrade DX (e.g. no Fast Refresh).

---

#### Rules & Plugins Control

Added controlled extension system:

```text
rules: {
  extend?: RuleSetRule[]
  override?: RuleSetRule[]
}

plugins: {
  extend?: WebpackPluginInstance[]
  override?: WebpackPluginInstance[]
}
```

- Safe extension via `extend`
- Full override via `override` (advanced usage)

---

#### Build Plugins System (Lifecycle Hooks)

Introduced a new internal plugin system for extending the build pipeline:

```ts
buildPlugins: [
  {
    setup(ctx) {
    },
    applyBase(config) {
    },
    applyDev(config) {
    },
    applyProd(config) {
    }
  }
]
```

##### Lifecycle stages:

- `setup` → runs before config creation (options preparation)
- `applyBase` → extends base config
- `applyDev` → runs only for development config
- `applyProd` → runs only for production config

##### Key benefits:

- Full control over config lifecycle without mutating core logic
- Clean separation between core and extensions
- Enables framework-level extensibility

##### Stability guarantees:

- Automatic plugin deduplication prevents conflicts and double execution
- Safe integration with existing `plugins.extend` / `override` APIs
- No direct mutation of Webpack config metadata (uses WeakMap)

---

#### Hosting Integration

- Automatic hosting detection
- Built-in support for:
  - Vercel (`vercel.json`)
  - Static hosting (SPA fallback)
- Modules:
  - `detect-hosting`
  - `get-vercel-config`
  - `get-redirects`

---

New Plugin System

- `HostingRoutingPlugin`
- `PugTemplatesPlugin`

Improved:

- plugin lifecycle handling
- better separation from config logic

---

#### Testing

Massively improved test coverage and quality:

##### Added:

- ✅ Unit tests (core, options, hosting, plugins)
- ✅ Integration tests (config behavior)
- ✅ E2E tests (real webpack builds with fixtures)
- ✅ Snapshot tests (config structure regression protection)

##### Test structure:

```text
unit/
integration/
e2e/
snapshots/
```

---

##### Highlights:

- Real-world fixtures (SPA + MPA, JS/TS, SCSS/Less)
- Snapshot-based regression detection
- Stable config normalization for testing

---

#### Internal Improvements

- Refactored config creation:
  - `createBaseConfig`
  - `createDevConfig`
  - `createProdConfig`
- Improved merge strategies:
  - `resolve`
  - `devServer`
  - `optimization`
- Stronger typing across entire codebase

#### Cleanup

- Removed legacy config patterns
- Simplified public API
- Reduced internal coupling

---

### Breaking Changes

- Template system is no longer strictly tied to Pug
- `pugRule` and `PugTemplatesPlugin` are now conditionally applied
- Invalid combinations are now validated:
  - `templates.type = 'none'` cannot have `entry
  - `MPA` requires `templates.entry`

---------------------------------------

## Legacy (pre-1.0.0)

All versions prior to 1.0.0 belong to the package:

```text
@razerspine/webpack-core
```

Legacy versions include:

- Early architecture
- Initial template system
- Basic config generation

> These versions are no longer actively maintained.

## [1.10.0] - 2026-03-13

### Changed

- **Dependency Update**: Upgraded `pug-plugin` to `^6.1.0`.
  - Fixes vulnerabilities in transitive dependencies by forcing `minimatch@10` and `glob@13`.
  - Includes the latest `html-bundler-webpack-plugin` for improved asset handling.
- **Environment Requirements**: Updated minimum required **Node.js version to 20**.
- **Cleanup**: Prepared for the removal of manual `overrides` in consumer templates (
  resolves [issue #110](https://github.com/webdiscus/pug-plugin/issues/110)).

### Fixed

- **Security**: Eliminated deep-level dependency warnings related to older versions of `glob` and `minimatch`.

---

## [1.9.0] - 2026-03-13

### Added

- **Smart Auto-Hosting Adapter**
  - Integrated `detectHosting()` utility to automatically identify deployment platforms (**Vercel, Netlify, Cloudflare,
    GitHub Pages**).
  - **Zero-Config Routing**: Automatically generates platform-specific configuration files (`_redirects`, `vercel.json`)
    based on `appType`.
  - **Interactive Build Logs**: Added `infrastructureLogger` integration. The build now informs the developer about
    detected platforms (e.g., `📦 Netlify detected. Generating _redirects for SPA...`).
- **Enhanced SPA Fallback Strategy**
  - Automated `404.html` generation for **GitHub Pages** and static hosts when in SPA mode.
  - Ensures seamless client-side routing without manual file duplication.

### Changed

- **Architectural Refactoring**
  - Decoupled hosting logic into specialized utilities: `getRedirects`, `getVercelConfig`, and `detectHosting`.
  - Improved `createProdConfig` maintainability by moving business logic out of the main configuration factory.
- **Production Alignment**
  - `createProdConfig` now actively reads `_meta.appType` from `LoaderOptionsPlugin` to synchronize routing logic with
    the development server.

### Fixed

- **Type Safety**: Improved Webpack 5 internal typing for asset emission using `sources.RawSource`.
- **Build Reliability**: Replaced `copy-webpack-plugin` for generated assets with a native Webpack emission strategy to
  prevent "file not found" errors during build.

---

## [1.8.0] - 2026-03-13

### Added

- **Automated Deployment Assets Generation**
  - Integrated `RoutingPlugin` into `createProdConfig` to handle host-specific routing files.
  - **Vercel Support**: Automatically generates `vercel.json` with correct rewrite rules based on `appType`.
  - **Netlify/Cloudflare Support**: Automatically generates `_redirects` file.
  - **Zero-Config Deployment**: Routing files are generated in-memory during the build and emitted directly to the
    `dist` folder.
- **Enhanced SPA Fallback**
  - Added automatic generation of `404.html` (as a copy of `index.html`) for SPA mode.
  - Ensures seamless routing on platforms like **GitHub Pages** without manual configuration.

### Fixed

- **Type Safety**: Improved Webpack 5 internal typing for asset emission using `sources.RawSource`.
- **Build Reliability**: Replaced `copy-webpack-plugin` for generated assets with a native Webpack emission strategy to
  prevent "file not found" errors during build.

### Changed

- **Production Alignment**: `createProdConfig` now actively reads `_meta.appType` from `LoaderOptionsPlugin` to
  synchronize routing logic with the development server.

---

## [1.7.2] - 2026-02-22

### Added

- **Universal Pug Loading Strategy**
  - Introduced `pugRule()` with `oneOf` logic to handle different Pug contexts.
  - **Component Support**: Pug files imported via JS/TS are now compiled into functions (`method: 'compile'`), enabling
    Angular-like component architecture.
  - **Static Entry Support**: Pug files used as entry points continue to render as static HTML (`method: 'render'`).
  - This dual-mode approach ensures SPA components work seamlessly without breaking existing MPA templates.
- **Dynamic SPA Routing Infrastructure**
  - Added support for client-side routing by decoupling Pug templates from the global layout in SPA mode.
  - Enabled support for `document.title` updates and `data-link` interception within the starter templates.

### Changed

- **Refactored** `templatesLoader`
  - Decoupled loader logic from the `PugPlugin` instance.
  - Removed global `loaderOptions` from `PugPlugin` to delegate responsibility to the new specialized `pugRule()`.
  - Improved compatibility between dynamic imports and static page generation.
- **Clean Architecture Alignment**
  - Updated `base.ts` to include `pugRule()` in `module.rules`, establishing a standard for how assets are resolved
    across all 8
  - template variations (JS/TS, SCSS/Less, MPA/SPA).

---

## [1.7.1] - 2026-02-22

### Added

- **SPA Support (Experimental Stable API)**
  - Introduced new `appType` option: `'mpa' | 'spa'`
  - `mpa` remains the default mode (template directory driven)
  - `spa` mode supports a single Pug entry file and outputs `index.html`
  - Enables SPA-style projects while preserving template-driven architecture

- **Options Normalization Layer**
  - Introduced `normalizeCoreOptions()` (internal utility)
  - Centralized default resolution for:
    - `mode`
    - `appType`
    - `templates.entry`
    - `resolve.alias`
  - Eliminates duplicated fallback logic across config layers
  - Establishes a single source of truth for configuration defaults

- **Improved Templates Validation**
  - Validation logic now differentiates between:
    - Directory entry (MPA)
    - Single file entry (SPA)
  - Prevents incorrect entry usage at build initialization

### Changed

- **Architecture Refactor**
  - Removed default resolution logic from `templatesLoader`
  - Simplified `validateCoreOptions` to focus only on value validation
  - Moved filesystem validation responsibility into template loader
  - Improved internal separation of concerns

- **Cleaner Internal API Design**
  - Base config now operates on normalized options
  - Reduced configuration coupling
  - Improved long-term scalability (SSR / future app types)

### Notes

- No breaking changes were introduced.
- Default behavior remains `mpa`.
- Fully backward compatible with existing templates.
- SPA mode is stable but recommended for controlled usage.

---

## [1.4.1] - 2026-02-19

### Changed

- **Package Metadata**: Updated `package.json` to reflect its place within the monorepo.
  - Added `repository` information pointing to the specific subdirectory.
  - Added `homepage` and `bugs` URLs for better transparency and issue tracking.

---

## [1.4.0] - 2026-02-19

### Changed

- **Peer Dependency**: Updated `pug-plugin` peer dependency range from `^5` to `^5 || ^6`.
  - Enables compatibility with `pug-plugin@6`.
  - Removes installation conflicts when templates upgrade to the latest pug-plugin version.
  - Preserves backward compatibility with existing templates using v5.
- **Internal Dev Alignment**: Updated local `devDependencies` to use `pug-plugin@^6.0.0` for internal testing and
  validation.

### Security

- Resolves npm audit warnings caused by transitive dependencies
  (`js-beautify → editorconfig → glob → minimatch`).
- No runtime changes were introduced.
- No production bundle impact.

### Notes

- This release does **not introduce breaking changes**.
- Public API remains unchanged.
- Fully backward compatible with existing templates.
- Recommended update before upgrading templates to `pug-plugin@6`.

---

## [1.2.3] - 2026-02-17

### Added

- **Validation Layer**: Introduced `validateCoreOptions()` inside `createBaseConfig`.
  - Validates `mode`, `scripts`, and `styles` values.
  - Ensures the templates entry directory exists before Webpack initialization.
  - Prevents silent runtime failures in pug-plugin due to invalid configuration.

### Changed

- **Dev Server Default Behavior**: Enabled `open: true` in default `devServer` configuration.
  - Development server now automatically opens the browser.
  - Improves developer experience for starter templates.

### Notes

- This release does **not introduce breaking changes**.
- Public API remains unchanged.
- Existing templates continue to work without modification.

---

## [1.2.1] - 2026-02-12

### Added

- **Flexible Configurations:** Added an optional `options` argument to both `createDevConfig` and `createProdConfig`.
- Users can now override default `devServer` settings or Webpack production optimizations without losing the base
  functionality.
- Integrated `webpack-merge` into `createDevConfig` for safer property merging.

### Fixed

- Updated internal documentation and clarified version history in `CHANGELOG.md`.

---

## [1.2.0] - 2026-02-12

### Changed

- **Enhanced File Watching:** Updated `createDevConfig` to watch all files recursively in the `src/` directory (
  `src/**/*`). This ensures `webpack-dev-server` reacts to changes in any file type (images, JSON, new assets) without
  manual configuration.
- **Improved Dev Routing:** Configured `historyApiFallback` in development mode.
  - Set `disableDotRule: true` to allow dots in URLs (useful for complex routing).
  - Added a global rewrite rule to serve `/404.html` for any non-existent paths, enabling better local testing of 404
    error pages and SPA-like navigation.
- **DevServer Optimization:** Set `hot: false` and `liveReload: true` as a stable default for multipage template builds
  to ensure consistent page refreshes upon file changes.

---

## [1.1.7] - 2026-02-11

### Changed

- Updated `README.md`
- Updated `package.json` metadata (keywords, published files)

### Stable Release Note

- **Important:** Versions prior to 1.1.6 were part of a stabilization phase and are not recommended for production use.
  This release marks the stable baseline.

---

## [1.1.6] - 2026-02-05

### Changed

- Updated `package.json` metadata (keywords, published files)
- Updated `README.md`

---

## [1.1.5] - 2026-02-05

### Fixed

- Stabilized production webpack configuration for pug-plugin driven builds
- Disabled `splitChunks` and `runtimeChunk` to prevent asset resolution issues
- Ensured predictable output structure in production mode
- Reduced risk of entry-related build failures

### Notes

- This release finalizes the stabilization phase of the production configuration
- Recommended as a stable baseline for template usage

---

## [1.1.4] - 2026-02-05

### Fixed

- Final stabilization of production configuration
- Ensured consistent build behavior for pug-plugin driven templates

---

## [1.1.0 – 1.1.3] - 2026-02-05

### Fixed

- Multiple fixes for production configuration edge cases
- Improved compatibility between pug-plugin, assets loader, and webpack optimization
- Stabilized production builds for template-driven entry points

---

## [1.0.9] - 2026-02-05

### Fixed

- Removed implicit webpack entry from production config
- Fixed production build failure caused by default webpack entry resolution

---

## [1.0.8] - 2026-02-05

### Fixed

- Fixed `resolve.alias` handling across loaders and pug-plugin

---

## [1.0.7] - 2026-02-05

### Fixed

- Fixed Pug asset resolution in production mode
- Passed webpack `resolve.alias` into pug-plugin resolver
- Ensured consistent alias behavior in development and production

---

## [1.0.6] - 2026-02-05

### Fixed

- Fixed webpack plugin instance mismatch when used via `npm link`
- Moved `webpack-dev-server` and `pug-plugin` to `peerDependencies`
- Ensured a single webpack instance is used in consumer templates

---

## [1.0.5] - 2026-02-04

### Fixed

- Explicitly disabled webpack default entry (`./src`)
- Ensured stable behavior when using pug-plugin as the primary entry system

---

## [1.0.4] - 2026-02-04

### Fixed

- Fixed TypeScript typing for `webpack-dev-server`
- Properly extended webpack Configuration with devServer types

---

## [1.0.3] - 2026-02-04

### Fixed

- Fixed webpack default entry fallback (`./src`)
- Prevented webpack from resolving non-existing JS entry when using pug-plugin
- Stabilized template entry handling via `templatesLoader`

### Internal

- Clarified responsibility between webpack entry and pug-plugin entry

---

## [1.0.2] - 2026-02-04

### Fixed

- Fixed ENV mode option typing
- Stabilized base configuration behavior

## [Unreleased]

### Changed

- Updated README.md
