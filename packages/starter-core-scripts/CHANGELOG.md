# Changelog

All notable changes to this project will be documented in this file.

---

## [0.5.1] - 2026-03-07

### Fixed

- **IDE Support (DX)**: Fixed an issue where WebStorm and VS Code could not resolve JSDoc and types for the JavaScript
  version of the package.
- **Package Exports**: Corrected the `exports` and `types` paths in `package.json` to match the actual `tsup` output
  directory.
- **Type Resolution**: Reordered the `exports` field to prioritize `types` mapping, ensuring that IDEs correctly pull
  documentation from `.d.ts` files even when consuming the compiled `.js` bundle.

### Changed

- **Package Metadata**: Cleaned up the `main`, `module`, and `types` fields to point directly to the `dist/` root,
  aligning with the current `tsup` build configuration.
- **SEO & Discoverability**: Expanded the `keywords` list in `package.json` to cover core functionality (DI, Router,
  Theme Management, I18n) and improve npm search visibility.

---

## [0.5.0] - 2026-03-06

### Added

- **Route Guards**: Introduced `canActivate` support for routes. Guards support asynchronous logic, blocking
  navigation (`false`) or redirecting to another route (`string` path).
- **Strict DI Mode**: The `DIContainer` now operates in strict mode. Services must be explicitly registered via
  `bootstrapApplication({ providers: [...] })`. Automatic instantiation of services is disabled to prevent hidden
  dependencies and silent runtime failures.
- **Global `inject()` helper**: Added a lightweight injection helper that retrieves services from the global
  `DIContainer`, allowing dependencies to be resolved inside components and services.
- **Async Component Lifecycle**: `BaseComponent` now supports asynchronous lifecycle hooks.
  - `render()` may return a `Promise`
  - `onInit()` may return a `Promise`
  - `mount()` is now `async` and ensures sequential execution
- **Router Guards Execution**: Guards are executed sequentially before navigation. Navigation proceeds only if all
  guards return `true`.
- **Router Navigation Error Hook**: Added optional `router.onNavigationError` callback for handling runtime navigation
  errors.
- **Bootstrap Error UI**: Added a built-in visual error overlay for fatal bootstrap failures when no custom
  `onError` handler is provided.
- **provideRouter() Helper**: Introduced a helper for declarative router configuration through the
  `providers` array, inspired by Angular's DI patterns.

### Changed

- **Router Initialization Flow**
  - Router no longer starts automatically from the constructor.
  - `router.start()` must be called to initialize listeners and perform the first render.
  - This call is handled automatically by `bootstrapApplication`.
- **BaseComponent Lifecycle**
  - `mount()` is now asynchronous and awaits both `render()` and `onInit()`.
  - Router now waits for full component initialization before completing navigation.
- **Component Cleanup**
  - All reactive stores, event listeners, and bindings are tracked via `cleanupCallbacks`.
  - `destroy()` now guarantees deterministic cleanup to prevent memory leaks.
- **Bootstrap API**
  - `bootstrapApplication()` now returns `Promise<void>`, allowing developers to wait for full application readiness.
- **AppConfig**
  - `routes` is now optional when routing is provided via `provideRouter()` in the `providers` array.

### Refactored

- **Router Navigation Safety**
  - Introduced `safeRender()` wrapper to prevent runtime navigation errors from breaking the application.
  - All runtime router errors are normalized and handled internally.
- **Guard Execution**
  - Guard errors are caught internally and treated as blocked navigation.
- **Error Normalization**
  - Router now normalizes unknown error types (`string`, `object`, etc.) into proper `Error` instances.
- **Bootstrap Provider Resolution**
  - `bootstrapApplication` now supports both:
    - `useValue`
    - `useFactory` (including async factories)
- **Initialization Order Fix**
  - The Router instance is now registered in the DI container **before calling `router.start()`**.
  - This ensures `inject(Router)` works during the first page render.

### Breaking Changes

- **Strict Dependency Injection**

  Services can no longer be auto-instantiated by the DI container.

  Any service used with:

  ```ts
    inject(MyService)
  ```

  **must be registered** in:

  ```ts
  bootstrapApplication({
    providers: [{provide: MyService}]
  })
  ```

- **Component Lifecycle**
  `BaseComponent.mount()` now returns `Promise<void>`.
  Custom code interacting with component lifecycle may need to support `async/await`.

- **Router Lifecycle**
  The Router constructor no longer triggers navigation automatically.
  `start()` must be called to initialize routing (handled automatically by `bootstrapApplication`).

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
