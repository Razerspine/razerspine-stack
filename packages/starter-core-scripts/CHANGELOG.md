# Changelog

All notable changes to this project will be documented in this file.

---

## [0.5.0] - 2026-03-03

### Added

- **Route Guards**: Introduced `canActivate` support for routes. Guards support asynchronous logic, blocking
  navigation (returning `false`), or redirecting (returning a `string` path).
- **Strict DI Mode**: The `DIContainer` now operates in strict mode. Services must be explicitly registered via
  `bootstrapApplication`. Automatic instantiation is disabled to prevent silent failures and hidden dependencies.
- **Async Lifecycle Hooks**: `BaseComponent` now supports asynchronous `onInit()` and `render()`. The `mount()` method
  is now `async` and ensures sequential execution.
- **DI & Bootstrap**: Added `provideRouter(routes)` helper for Angular-like declarative routing configuration.
- **Router**: Added public `start()` method to manually trigger navigation listeners and initial rendering.
- **Router**: Added an `initialized` flag to prevent redundant lifecycle attachments.
- **Error Handling**: New `onNavigationError` hook in `Router` and a specialized `defaultErrorHandler` in bootstrap for
  displaying critical startup errors in the UI.

### Changed

- **BaseComponent**: Refactored cleanup logic. All subscriptions, event listeners (click/forms), and store proxies are
  now tracked via `cleanupCallbacks` and automatically disposed of in `destroy()`.
- **Bootstrap**: `bootstrapApplication` now returns `Promise<void>`, allowing developers to await full app readiness.
- **AppConfig**: The `routes` field is now optional, as they can be provided via `providers` array using
  `provideRouter`.
- **Router**: The constructor no longer triggers routing automatically. `start()` must be called (handled automatically
  by `bootstrapApplication`).

### Refactored

- **Navigation Flow**: Introduced `safeRender` and `handleNavigationError` to centralize runtime error management.
  Errors during navigation no longer crash the entire application.
- **Initialization Order**: `bootstrapApplication` now registers the `Router` instance in the DI container before
  calling `.start()`. This fixes issues where `inject(Router)` would fail during the first page render.
- **Provider Registry**: Enhanced `bootstrapApplication` to support `useFactory` (with async support) and `useValue`.

### Breaking Changes

- **Strict DI**: Any service injected via `inject()` must now be registered in the `providers` array of
  `bootstrapApplication`.
- **Router Initialization**: If manually instantiating `Router` outside of `bootstrapApplication`, you must now call
  `.start()` explicitly.
- **Component Mount**: `BaseComponent.mount()` is now a `Promise`. Custom implementations of `render` or `onInit` should
  be checked for compatibility with `async/await`.

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
