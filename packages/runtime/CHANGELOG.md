# Changelog

All notable changes to this project will be documented in this file.

This project follows Semantic Versioning.

---

## [1.0.2] - 2026-03-31

### Changed

- Updated repository links in `package.json` following the monorepo renaming.
- Bumped minimum Node.js requirement to `^20.10.0` (LTS recommended).

### Fixed

- Corrected typos and grammatical errors in `README.md`

---

## [1.0.1] - 2026-03-23

### Added

- `data-click` now supports method expressions with arguments:
  - `data-click='deleteUser(1)'`
  - Supported types: numbers, booleans, strings
- Added lightweight expression parser (`parseExpression`) without `eval / Function`
- Event handlers now receive extended signature:
  ```text
  method(...args, event, element)
  ```

### Improved

- Refactored `bindClickEvents`:
  - improved method resolution and warnings
- Improved `data-model`:
  - correct handling of `radio` (checked-based)
  - correct handling of `checkbox` (boolean)
  - prevents incorrect value overwrites
  
### Fixed

- Fixed `data-click` argument handling (removed need for `context["method(1)"]`)
- Fixed incorrect `data-model` behavior for radio inputs
- Fixed incomplete two-way binding when `bindForms` was not used

### Notes

- No breaking changes - existing `data-click="method"` still works
- For full two-way binding, use `bindForms` together with `applyBindings`

---

## [1.0.0] - 2026-03-16

🚀 **First stable release of the runtime engine.**

This version introduces a fully refactored architecture, a stabilized public API,
significant runtime optimizations, and full test coverage.

The package will be renamed from:

`@razerspine/starter-core-scripts`
➡ `@razerspine/runtime`

---

### Runtime Architecture

This release introduces a **completely redesigned modular runtime architecture**.

The codebase has been reorganized into clearly separated modules,
making the runtime easier to maintain, test, and extend.

The previous structure mixed multiple responsibilities in large files.
The new architecture introduces **domain-driven module separation**.

#### New Module Structure

```text
src/
├── core
│ ├── di-container.ts
│ └── di.types.ts
│
├── router
│ ├── router.ts
│ └── router.types.ts
│
├── reactivity
│ └── store.ts
│
├── view
│ ├── base-component.ts
│ ├── bootstrap.ts
│ └── bindings/
│
├── http
│ ├── api-service.ts
│ └── api-error.ts
│
├── platform
│ ├── theme-service.ts
│ └── translation-service.ts
│
├── utils
│ ├── console-logger.ts
│ └── dom-utils.ts
```

---


#### Module Responsibilities

##### core
Contains the **Dependency Injection container** and DI related types.

Responsible for:
- service registration
- dependency resolution
- global injection helper

---

##### router
SPA navigation engine.

Features:
- route matching
- async navigation
- route guards
- safe component rendering

---

##### reactivity
Reactive state system based on **Proxy**.

Provides:

```text
createStore()
```

Features:
- deep observation
- nested proxy caching
- stable references
- manual cleanup via `disconnect()`

---

##### view
Component system and DOM rendering engine.

Contains:

- `BaseComponent`
- runtime bootstrap
- template bindings engine

Bindings supported:

```text
data-bind
data-model
data-show
data-class
data-for
data-click
```

> The bindings engine was refactored into **processor-based architecture**:

```text
bindings/
└── engine/
└── processors/
```

Each directive now has an isolated processor:

- `bind.processor`
- `class.processor`
- `for.processor`
- `model.processor`
- `show.processor`

This greatly improves:

- maintainability
- extensibility
- testability

---

##### http
HTTP utilities and API abstraction.

Includes:

- `ApiService`
- `ApiError`
- request configuration types

---

##### platform
Platform-level services for common application concerns.

Includes:

- `ThemeService`
- `TranslationService`

These services are designed to be used via the DI container.

---

##### utils
Shared utility helpers used across the runtime.

Examples:

- DOM helpers
- console logging utilities

---

#### Benefits of the New Architecture

The refactor introduces several important improvements:

- **clear separation of concerns**
- **smaller focused modules**
- **improved testability**
- **easier future feature development**
- **better long-term maintainability**

The runtime is now structured similarly to modern frontend frameworks,
with clear boundaries between:

- dependency injection
- routing
- reactivity
- rendering
- platform services

---

### Added

#### Runtime Architecture

- **Complete runtime architecture redesign**
- Clear separation of modules:
  - `core`
  - `router`
  - `view`
  - `reactivity`
  - `bindings`
  - `platform`

- **Bootstrap system**
  - `bootstrapApplication`
  - `provideRouter`
  - configurable `providers`

- **Strict Dependency Injection**
  - DI container operates in strict mode
  - services must be explicitly registered
  - prevents hidden dependencies

- **Global `inject()` helper**
  - allows resolving dependencies outside constructor context

---

#### Router

- SPA router with:
  - route configuration
  - dynamic navigation
  - route guards
  - async navigation flow

- `canActivate` route guards
  - supports async guards
  - allows blocking navigation
  - supports redirect via string return

- Router lifecycle improvements
  - `router.start()` initialization
  - deterministic navigation flow

- Navigation error hook

```ts
router.onNavigationError
```

---

#### Component System

- **BaseComponent**
  - lifecycle hooks
  - state management
  - deterministic cleanup
  
Lifecycle:

```text
render → initEventListeners → update → onInit
```

Hooks:

```text
onInit()
onDestroy()
```

- Async lifecycle support

```text
render() -> Promise
onInit() -> Promise
mount() -> async
```

---

#### Reactive system

- **Proxy-based reactive store**

```text
createStore()
```

Features:

- deep observation
- WeakMap proxy caching
- stable references
- manual cleanup via `disconnect()`

Performance improvements:

- cached nested proxies
- optimized `set` trap
- prototype-write protection for `data-for` scopes

---

#### View Engine

Declarative template bindings:

```text
data-bind
data-model
data-show
data-class
data-for
data-click
```

Capabilities:

- two-way binding
- list rendering
- conditional rendering
- dynamic classes
- event delegation

Performance improvements:

- optimized `data-for` loop rendering
- context caching
- minimized DOM traversal

---

#### Bootstrap system

- configurable application entrypoint

```text
bootstrapApplication({
  rootId,
  routes,
  providers
})
```

Features:

- async provider factories
- route resolution via config or providers
- router auto-start
- DOM readiness detection

---

#### Error Handling

Runtime safety improvements:

- normalized error handling
- safe router rendering
- bootstrap error overlay
- configurable `onError` hook

---

#### Testing

Full testing suite introduced.

Test stack:

- **Vitest**
- **JSDOM**

Coverage includes:

**Unit Tests**

- DI container
- Router
- Store reactivity
- Bindings engine
- Services
- Bootstrap logic

**E2E Runtime Tests**

- router navigation
- bindings interaction
- list rendering
- runtime integration

Total:

```text
15 test files
120 tests
```

---

### Changed

#### Performance

Significant runtime optimizations:

- `data-for` rendering loop optimized
- reduced Proxy allocations
- context caching in bindings
- faster DOM update cycles

---

#### Bootstrap Refactor

Internal bootstrap logic split into utilities:

```text
bootstrap.utils.ts
```

Extracted helpers:

- `resolveRoutes`
- `waitForDOM`
- `startRouter`
- `handleBootstrapError`

Improves:

- testability
- separation of concerns
- runtime stability

---

#### Router Initialization

Router no longer auto-starts in constructor.

Initialization now occurs via:

```text
router.start()
```

Handled automatically by `bootstrapApplication`.

---

#### Codebase Improvements

- improved TypeScript typing
- stricter generics
- improved JSDoc annotations
- consistent module structure
- clearer internal APIs

---

### Breaking Changes

#### Strict DI

Services are **no longer auto-instantiated**.

Before:

```text
inject(Service)
```

worked even if service was not registered.

Now **must be registered**:

```ts
bootstrapApplication({
providers: [{ provide: MyService }]
})
```

---

#### Router Lifecycle

Router constructor no longer triggers navigation.

Router must be started explicitly:

```text
router.start()
```

Handled automatically by bootstrap.

---

#### Component Lifecycle

`BaseComponent.mount()` is now async.

Code interacting with lifecycle should support:

```text
await component.mount()
```

-----------------------------------------------------

# Legacy Releases

The following versions belong to the **pre-runtime architecture** era.

They are preserved for historical context.

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
