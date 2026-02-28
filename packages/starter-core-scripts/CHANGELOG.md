# Changelog

All notable changes to this project will be documented in this file.

---

## [0.4.0] - 2026-02-28

### Added
- **View Engine**: Introduced a lightweight reactive system for DOM manipulation.
- **BaseComponent**: Added an abstract class for creating stateful UI components.
- **setState**: Added a protected method to `BaseComponent` for safe, partial state updates.
- **createStore**: Added a Proxy-based reactive store with deep observation support.
- **applyBindings**: Added a synchronization engine supporting:
  - `data-bind`: Text content synchronization.
  - `data-model`: Two-way input binding (state ↔ DOM).
  - `data-show`: Visibility toggling (with negation `!` support).
  - `data-class`: Conditional CSS class management.
  - `data-for`: Array iteration with support for nested scopes and `_index` helpers.
- **Scope Guarding**: Implemented `isDirectBinding` to ensure nested loops don't conflict with parent state.
- **bindClickEvents**: Added high-performance click event delegation via `data-click`.

### Improved
- **Proxy Optimization**: Added WeakMap-based proxy caching to prevent redundant Proxy creation and improve performance.
- **Two-Way Binding**: Implemented reverse synchronization (state → input value) for `data-model`.
- **Update Cycle**: Removed redundant manual `update()` calls in form binding (store-driven reactivity only).
- **Internal Stability**: Improved deep reactivity consistency for nested state objects.
- **Project Structure**: Organized core scripts into `services/`, `view/`, and `utils/` directories.
- **Type Safety**: Improved generic types for state management in components using `Partial<T>`.

### Notes
- `data-for` currently performs full re-rendering (no diffing algorithm).
- Designed for lightweight starter templates and small-to-medium UI layers.

---

## [0.3.2] - 2026-02-24

### Fixed
- **ApiService**: Resolved `TypeError: body stream already read` by cloning the response stream during error handling.
- **ApiService**: Fixed a bug where 404 responses with empty bodies caused uninformative "Unknown API Error" messages.
- **ApiService**: Improved `ApiError` to provide a fallback message including the HTTP status code when `statusText` is missing.
- **ApiService**: Enhanced query parameter serialization to skip `null` and `undefined` values.

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
