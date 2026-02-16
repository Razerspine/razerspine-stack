# Changelog

## [1.0.0] - 2026-02-16

### Breaking

- Removed deprecated `--template` option
- Template selection is now strictly feature-based (`--style + --script`)
- CLI no longer supports explicit template selection

### Improved
- Simplified CLI logic
- Reduced surface API
- Fully feature-driven UX

---

## [0.3.1] - 2026-02-11

### Added
- Strict validation for feature-based CLI flags:
  - CLI now throws an error if only one of `--style` or `--script` is provided
  - Both flags must be passed together

### Changed
- `--template` option is now officially marked as **deprecated**
- CLI displays a deprecation warning when `--template` is used
- CLI displays a warning when `--template` is used together with `--style` / `--script`
- Improved internal resolution priority:
  - `--template` overrides feature flags
  - `--style + --script` are resolved only when `--template` is not provided

### Notes
- No breaking changes
- Existing CI workflows using `--template` continue to work
- Feature-based selection (`--style + --script`) remains the recommended approach

---

## [0.3.0] - 2026-02-10

### Added
- New CLI workflow based on feature selection:
  - `--style (scss | less)`
  - `--script (js | ts)`
- Automatic template resolution via internal `resolveTemplateKey`
- Interactive prompts now guide users through style and script selection instead of raw template names
- New E2E tests covering `--style + --script` CLI usage

### Changed
- Template selection prompt has been removed from the default interactive flow
- CLI UX is now feature-oriented instead of template-oriented
- Documentation updated to reflect the new recommended usage pattern

### Notes
- `--template` option is still supported for advanced and CI use cases
- No breaking changes for existing users
- Node.js >= 18 remains required

---

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

---

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

---

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

---

## [0.2.3] - 2026-02-06

### Added
- Explicit mono-repo metadata for npm publishing (`repository.directory`, `homepage`, `bugs`)

### Changed
- Updated documentation links to use absolute GitHub URLs for mono-repo compatibility
- Improved README navigation reliability on npm registry

### Notes
- This release stabilizes documentation visibility for mono-repo setups
- No functional changes to CLI behavior

---

## [0.2.2] - 2026-02-06

### Fixed 
- **Documentation links** in `README.md` now resolve correctly on npm and GitHub; paths updated.

### Notes
- Republished package as **0.2.2**.

---

## [0.2.1] - 2026-02-06

### Added
- Documentation section to README
- Initial `docs/` directory with usage and templates overview

### Changed
- Included `docs`, `README.md`, `LICENSE`, and `CHANGELOG.md` in npm package

---

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
