# Changelog

## [0.2.8] - 2026-02-09

### Changed
- Renamed npm package to scoped name: `@razerspine/create-webpack-starter`
- Updated all documentation and references to use the scoped package name

### Fixed
- Unblocked automated publishing via GitHub Actions using npm Trusted Publisher (OIDC)
- Resolved npm publish failures caused by attempting to publish an unscoped package from CI

### Notes
- This change does not affect CLI behavior or usage
- The scoped package name is required for secure, non-interactive CI publishing with provenance support
- Existing users should install the CLI using:
  ```bash
  npx @razerspine/create-webpack-starter
  ```

## [0.2.7] - 2026-02-09

### Fixed
- Fixed ESM/CommonJS incompatibilities on Node.js 18+ by pinning CLI dependencies to stable CommonJS versions:
  - `inquirer@^8.2.6`
  - `ora@^5.4.1`
- Prevented CLI crashes caused by `ERR_REQUIRE_ESM` when running under Node.js 18 and CI environments

### Improved
- Improved E2E test stability in CI by running CLI in fully non-interactive mode
- CLI tests now explicitly pass `--template` flag to avoid interactive prompts in non-TTY environments
- Ensured consistent CLI behavior across Node.js versions 18, 20, 22+

### Notes
- No changes to CLI public API or user-facing commands
- This release focuses on runtime compatibility, CI stability, and long-term Node.js support


## [0.2.6] - 2026-02-08

### Fixed
- Ignored `node_modules/` and `dist/` directories when copying templates
- Prevented leaking local development artifacts into generated projects

### Improved
- Better developer experience for local template development
- More predictable project output regardless of template workspace state

### Notes
- No changes to CLI API or user-facing commands
- Templates remain fully standalone after generation


## [0.2.4 - 0.2.5] - 2026-02-07

### Added
- End-to-end (E2E) test suite for CLI behavior
- Tests for:
  - basic project creation
  - template selection
  - `--dry-run` mode
  - invalid template handling
- Temporary directory management with automatic cleanup
- Internal testing documentation (`docs/testing.md`)

### Changed
- Improved CLI test reliability by aligning tests with real user usage patterns

### Notes
- No changes to CLI runtime behavior
- This release focuses on test stability and maintainability


## [0.2.3] - 2026-02-06

### Added
- Explicit mono-repo metadata for npm publishing (`repository.directory`, `homepage`, `bugs`)

### Changed
- Updated documentation links to use absolute GitHub URLs for mono-repo compatibility
- Improved README navigation reliability on npm registry

### Notes
- This release stabilizes documentation visibility for mono-repo setups
- No functional changes to CLI behavior


## [0.2.2] - 2026-02-06

### Fixed 
- **Documentation links** in `README.md` now resolve correctly on npm and GitHub; paths updated.

### Notes
- Republished package as **0.2.2**.

## [0.2.1] - 2026-02-06

### Added
- Documentation section to README
- Initial `docs/` directory with usage and templates overview

### Changed
- Included `docs`, `README.md`, `LICENSE`, and `CHANGELOG.md` in npm package


## [0.2.0] - 2026-02-06

### Added
- Initial public release of `create-webpack-starter`
- Interactive CLI for creating webpack projects
- Support for Pug templates
- SCSS / Less styles
- JavaScript and TypeScript variants
- Automatic dependency installation

### Notes
- Designed to work with `@razerspine/webpack-core`
- Requires Node.js >= 18
