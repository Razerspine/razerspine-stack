# Changelog

All notable changes to this project are documented in this file.

This package went through an intensive stabilization phase while integrating
Webpack, pug-plugin, and template-driven builds. Multiple patch releases were
required to ensure correct behavior in both development and production modes.

---

## [1.1.7] - 2026-02-11

### Changed
- Updated `README.md`
- Updated `package.json` metadata (keywords, published files)

### Stable Release Note
- **Important:** Versions prior to 1.1.6 were part of a stabilization phase and are not recommended for production use. This release marks the stable baseline.


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
