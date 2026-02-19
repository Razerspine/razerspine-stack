# Changelog

All notable changes to this project will be documented in this file.

---

## [0.3.0] - 2026-02-19

### Changed

- **Updates devDependencies**: `rimraf@6.1.3`
- **Package Metadata**: Updated `package.json` to reflect its place within the monorepo.
  - Added `repository` information pointing to the specific subdirectory.
  - Added `homepage` and `bugs` URLs for better transparency and issue tracking.

---

## [0.2.0] - 2026-02-13

### Added
- Added `ApiService` for handling HTTP requests
- Added `ApiError` class for structured error handling
- Added `RequestConfig` type
- Exported new services from root index

### Improved
- Refactored folder structure from `modules/` to `services/`
- Updated documentation

---

## [0.1.0] - Initial Release

### Added
- ThemeService
- TranslationService
- ConsoleLogger
- ESM + CJS builds via tsup
