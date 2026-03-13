# Changelog

All notable changes to this project are documented in this file.

This package went through an intensive stabilization phase while integrating
Webpack, pug-plugin, and template-driven builds. Multiple patch releases were
required to ensure correct behavior in both development and production modes.

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
- **DevServer Optimization:** Set `hot: false` and `liveReload: true` as a stable default for multi-page template builds
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
