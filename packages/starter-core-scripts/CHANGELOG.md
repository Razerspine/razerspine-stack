# Changelog

All notable changes to this project will be documented in this file.

---

## [0.4.0] - 2026-03-01

### Added

- **Core Router**: Migrated the SPA Router to the `@razerspine/starter-core-scripts` package for centralized navigation
  logic.
- **Singleton Navigation**: Implemented Singleton pattern in `Router`, enabling global programmatic navigation via
  `Router.navigate()`.
- **Automated Lifecycle**: Introduced the `mount()` method in `BaseComponent` to orchestrate
  `render -> initEventListeners -> update -> onInit` in a single call.
- **Smart Rendering**: The Router now automatically detects and executes `mount()`, `render()`, or `destroy()` based on
  component capabilities.
- **View Engine**: Introduced a lightweight reactive system for DOM manipulation.
- **Component Lifecycle**: Added `onInit()` and `onDestroy()` hooks to `BaseComponent` for managed setup and teardown.
- **Memory Management**: Implemented a `cleanupCallbacks` registry in `BaseComponent` to automatically prune event
  listeners and observers.
- **BaseComponent**: Added an abstract class for creating stateful UI components.
- **setState**: Added a protected method to `BaseComponent` for safe, partial state updates.
- **createStore**: Added a Proxy-based reactive store with deep observation support and a manual `disconnect()` utility.
- **applyBindings**: Added a synchronization engine supporting `data-bind`, `data-model`, `data-show`, `data-class`, and
  `data-for`.
- **Scope Guarding**: Implemented `isDirectBinding` to ensure nested loops don't conflict with parent state.
- **bindClickEvents**: Added high-performance click event delegation via `data-click`.

### Improved

- **Developer Experience**: Removed the need to pass Router instances to components; navigation is now accessible
  globally.
- **Router Stability**: Added safety checks for root element existence and component method availability.
- **Proxy Optimization**: Added WeakMap-based proxy caching to prevent redundant Proxy creation.
- **Leak Prevention**: Refactored `bindForms` and `bindClickEvents` to return cleanup closures.
- **Two-Way Binding**: Implemented reverse synchronization (state → input value) for `data-model`.
- **Project Structure**: Consolidated core logic into the monorepo package for better maintainability.
- **Type Safety**: Improved generic types for state management using `Partial<T>` and added `Route` interfaces.

### Notes

- `data-for` currently performs full re-rendering (no diffing algorithm).
- **Architecture Evolution**: `createStore` now returns an object `{state, disconnect}` for explicit memory control.
- Designed as a robust foundation for SPA/MPA hybrid templates.

---

## [0.3.2] - 2026-02-24

### Fixed

- **ApiService**: Resolved `TypeError: body stream already read` by cloning the response stream during error handling.
- **ApiService**: Fixed a bug where 404 responses with empty bodies caused uninformative "Unknown API Error" messages.
- **ApiService**: Improved `ApiError` to provide a fallback message including the HTTP status code when `statusText` is
  missing.
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
