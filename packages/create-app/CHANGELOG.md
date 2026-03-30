# Changelog

## [1.0.0] - 2026-03-30

### 🚀 Major Release

This release introduces a **fully redesigned CLI architecture**, modern build system, improved DX, and a new package
name.
This is a ground-up rewrite focused on performance, type-safety, and smart automation.

---

## ⚠️ Breaking Changes

- **Package renamed**
  - `create-webpack-starter` → `@razerspine/create-app`
- **CLI command renamed**
  - `create-webpack-starter` → `create-app`
- **Binary path changed**
  - now points to bundled output: `dist/index.js`
- **Build system replaced**
  - `tsc` → `tsup` (dual ESM + CJS output)
- **Removed direct `package.json` imports**
  - replaced with injected `__VERSION__` constant
- **Templates branding updated**
  - `create-webpack-starter` → `create-app`

---

## Features

- Modern CLI built with:
  - `commander`
  - interactive prompts via `inquirer`
- Smart template resolution based on:
  - `appType` (mpa / spa)
  - `style` (scss / less)
  - `script` (js / ts)
- Dry-run mode:
  - `--dry-run` (no filesystem changes)
- Skip install:
  - `--no-install`
- Smart Package Manager Support:
  - New `--pm` flag (`npm | yarn | pnpm | bun`).
  - Hybrid detection: Prioritizes `User-Agent` (detects if run via pnpm dlx, bunx, etc.), then falls back to lock-file
    inspection in the target directory.
  - Supports `pnpm-lock.yaml`, `yarn.lock`, `package-lock.json`, and the latest `bun.lock` (Bun 1.2+).
- Improved error handling:
  - graceful exit for prompt cancellation
- Consistent CLI UX (help/version validation)

---

## Build System

- Switched to **tsup**:
  - ESM (`.mjs`) + CJS (`.cjs`)
  - bundled output (single entry)
  - fast builds
- Added:
  - `clean` script via `rimraf`
- Proper `exports` configuration:

  ```text
  "exports": {
    ".": {
      "require": "./dist/index.cjs",
      "import": "./dist/index.mjs"
    }
  }
  ```
- Shebang preserved for CLI execution

---

## Testing

- Migrated to **Vitest**
- Added full **E2E test suite**
- Implemented robust CLI test helper:
  - runs CLI via `tsx`
  - captures stdout/stderr
  - validates exit codes
  - includes timeout protection
- Fixed cleanup issues:
  - replaced `afterAll` with `afterEach`
  - eliminated race conditions
- Added global setup/teardown safety cleanup

---

## Architecture

- Introduced `TemplateService`:
  - template loading
  - metadata access
  - feature-based resolution
- Clean separation of concerns:
  - CLI layer
  - core pipeline
  - template system
- Pipeline-based app creation flow:
  - resolve template
  - prepare directory
  - copy files
  - install dependencies
- Added package manager abstraction layer:
  - install command resolver
  - script normalization

---

## DX Improvements

- Local CLI execution:

  ```bash
  npm run create-app -- my-app
  ```
- Proper argument forwarding via `--`
- Replaced `ts-node` with `tsx`
- Improved error messages and validation
- Cleaner logs with `kleur` and `ora`

---

## Package Manager Support

- Added support for multiple package managers:
  - `npm` (default)
  - `yarn`
  - `pnpm`
  - `bun`
- New CLI flag:
  ```bash
  create-app my-app --pm pnpm
  ```
- Hybrid Intelligent Detection:
  - User-Agent Priority: Automatically detects the package manager used to run the CLI (e.g., if you use `pnpm dlx` or
    `bunx`, the CLI will default to that manager).
  - Context-Aware Lock-file Search: Scans the target project directory for existing lock files to ensure consistency.
- Automatic detection based on lock files:
  - `pnpm-lock.yaml` → pnpm
  - `yarn.lock` → yarn
  - `bun.lockb` → bun
  - `package-lock.json` → npm
- Scripts normalization:
- `npm run` → `pnpm / yarn / bun run`
- Injected `packageManager` field into generated `package.json`

---

## Templates

- Cleaner Structure: Optimized internal template organization.
- Ecosystem Migration: All templates now point to the new published packages:
  - `@razerspine/build`
  - `@razerspine/runtime`
  - `@razerspine/ui`
- Smart Filtering: Enhanced the template copying engine. It now ignores:
  - Directories: `node_modules`, `dist`
  - Files: `package-lock.json`
- Metadata: Improved `template.json` validation for each scaffold.

---

## Internal

- Removed legacy build artifacts
- Simplified dist output structure
- Improved path resolution logic
- Better cross-platform compatibility

-----------------------------

## 🗂 Legacy

Previous versions of this package were published under:

- `create-webpack-starter`

They are now deprecated in favor of:

```bash
npm create @razerspine/create-app
```

---

## [1.1.4] - 2026-03-13

### Major Template Stabilization & Deployment Upgrade

This release introduces a major stabilization update across all project templates.  
It aligns the CLI with the latest versions of `@razerspine/webpack-core` and  
`@razerspine/starter-core-scripts`, improves production deployment support, and  
modernizes the internal template architecture.

### Updated

- All templates upgraded to **v0.0.5**
- Updated `@razerspine/webpack-core` to **^1.10.0**
- Updated `@razerspine/starter-core-scripts` to **^0.5.1**
- Updated `pug-plugin` to **^6.1.0**
- Removed all manual `overrides` from templates (dependency fixes now handled upstream)
- Updated minimum **Node.js requirement to v20+**

### Added

#### Automated Hosting Support

Production builds now automatically generate deployment configuration for modern static hosting platforms via
`@razerspine/webpack-core`.

Supported platforms:

- **Netlify**
- **Vercel**
- **Cloudflare Pages**
- **GitHub Pages**
- **Generic static hosting**

Generated files depend on the detected platform:

| Platform             | Generated File          |
|:---------------------|:------------------------|
| Netlify / Cloudflare | `_redirects`            |
| Vercel               | `vercel.json`           |
| GitHub Pages         | `404.html` SPA fallback |
| Static hosting       | `404.html` SPA fallback |

*Hosting detection is based on environment variables automatically provided by hosting providers.*

### SPA Runtime Architecture

All SPA templates now include a **lightweight dependency injection container** and a structured application bootstrap
system provided by `@razerspine/starter-core-scripts`.

#### Key features:

- Application bootstrap via `bootstrapApplication()`
- Provider-based dependency injection
- Router integration via `provideRouter()`
- Service injection via `inject()`
- Component lifecycle (`onInit`, `onDestroy`)
- `BaseComponent` runtime abstraction

#### Example application bootstrap:

```ts
bootstrapApplication({
  providers: [
    provideRouter(routes),
    {provide: ThemeService, useValue: themeService},
    {provide: ConsoleLogger, useValue: logger},
  ],
});
```

#### Example component using dependency injection:

```ts
export class HomePage extends BaseComponent<HomeState> {
  private logger = inject(ConsoleLogger);

  protected onInit() {
    this.logger.success('Home Page initialized!');
  }
}
```

#### Router Guards (canActivate)

The SPA Router now supports **route guards** through the `canActivate` API, allowing developers to control navigation
before a route is activated.

**Supported guard results:**

| Return Value | Behavior                      |
|:-------------|:------------------------------|
| `true`       | Allow navigation              |
| `false`      | Block navigation              |
| `string`     | Redirect to the provided path |
| `Promise`    | Async guard resolution        |

**Example configuration & usage:**

```ts
// route configuration
const routes: Route[] = [
  {path: '/', component: HomePage},
  {path: '/dashboard', component: DashboardPage, canActivate: [authGuard]},
];

// guard implementation
const authGuard: CanActivateFn = () => {
  const isLoggedIn = checkAuth();
  return isLoggedIn ? true : '/login';
};
```

Guards are executed sequentially and support asynchronous logic.

Navigation behavior:

- first failing guard stops navigation
- redirect guards trigger automatic router navigation
- guard errors are caught internally and handled by the router

### Template Architecture Improvements

All SPA templates now follow a unified project structure:

```text
src/
  app/
    app.ts
    routes.ts
    app.pug
  pages/
    home/
    not-found/
  shared/
    layout/
    mixins/
  assets/
    i18n/
    icons/
    images/
  styles/
    main.scss
  types/
```

### Key improvements:

- Feature-based page structure
- Shared UI layer
- Centralized application bootstrap
- Clear separation between application core and UI pages

### Test Build Scripts (Templates)

All templates now include testing scripts for verifying production builds across different hosting environments:

```json
{
  "test:build:netlify": "NETLIFY=true npm run build",
  "test:build:vercel": "VERCEL=true npm run build",
  "test:build:github": "GITHUB_ACTIONS=true npm run build",
  "test:build:cloudflare": "CF_PAGES=true npm run build"
}
```

### Security & Improvements

- Security: All templates now pass npm audit with 0 vulnerabilities.
- Cleanup: Removed temporary dependency overrides previously required for glob / minimatch.
- Reliability: More reliable production builds and better compatibility with modern static hosting.
- CI/CD: Improved CI compatibility with Node.js 20+.
- Stability: More stable TypeScript configuration across templates.

### Notes

- This release focuses on stability, deployment automation, and runtime architecture improvements.
- No breaking changes were introduced to the CLI interface.
- Existing projects generated with older versions remain fully compatible.

---

## [1.1.3] - 2026-03-01

### Major Template Architecture Upgrade

This release upgrades all templates to the new reactive View Engine powered by  
`@razerspine/starter-core-scripts@0.4.0`.

---

### Updated

- All templates upgraded to **v0.0.4**
- Upgraded to `@razerspine/starter-core-scripts@^0.4.0`
- Added `overrides` for dependency stability:
  - `minimatch@10.2.4`
- Updated internal Router usage to the centralized npm package version
- Fully updated `/docs` directory for SPA & MPA architecture

---

### Added

- **Centralized Router (from starter-core-scripts)**
  - Router migrated from template-local implementation to shared npm package
  - Singleton navigation via `Router.navigate()`
  - Automatic lifecycle orchestration support

- **BaseComponent Architecture (SPA templates)**
  - `mount()` lifecycle orchestration
  - `onInit()` and `onDestroy()` hooks
  - Built-in cleanup registry for memory safety
  - Proxy-based reactive state via `setState()`

- **Reactive View Engine (SPA & MPA)**
  - `createStore()` with deep Proxy observation
  - `applyBindings()` supporting:
    - `data-bind`
    - `data-model`
    - `data-show`
    - `data-class`
    - `data-for`
  - Delegated events via `data-click`
  - Automatic cleanup closures for listeners

- **Improved SPA lifecycle**

  Router now automatically detects and executes:
  - `mount()`
  - `render()`
  - `destroy()`

  based on component capabilities.

---

### Improved

- Stronger memory management via cleanup registry
- WeakMap-based Proxy caching (via core package)
- Better type safety using `Partial<T>` state generics
- Cleaner SPA template structure
- More production-ready default output
- Stronger architectural separation between CLI and runtime engine
- Unified Router + View Engine foundation across SPA & MPA

---

### Documentation

- Updated:
  - Getting Started
  - Templates
  - SPA Architecture
  - MPA Architecture
- Improved explanation of lifecycle and Router behavior

---

### Notes

- This release represents a structural evolution of generated projects.
- No CLI contract changes.
- No breaking changes for CLI usage.
- Existing generated projects are unaffected unless manually upgraded.

---

## [1.1.2] - 2026-02-25

### Updated

- All templates upgraded to use `@razerspine/starter-core-scripts@0.3.2`

### Added

- Official `--version` and `-v` CLI flags
- UX guard to prevent accidental project creation from unhyphenated commands:
  - `version / v`
  - `help / h`
- Clear suggestion messages for common CLI mistakes

### Fixed

- **ApiService** improvements (via `starter-core-scripts@0.3.2`):
  - Resolved `TypeError: body stream already read` by cloning response stream during error handling
  - Fixed empty 404 responses causing generic "Unknown API Error"
  - Improved `ApiError` fallback message when `statusText` is missing
  - Enhanced query parameter serialization (skips `null` / `undefined`)

### Improved

- Safer CLI behavior in non-interactive mode
- More predictable exit codes for invalid positional arguments
- Stronger E2E coverage for version/help flows

---

## [1.1.1] - 2026-02-23

### Updated

- All templates upgraded to **v0.0.3**
- Updated `@razerspine/pug-ui-kit` to **^1.5.1**
- Added `core-js@^3.48.0` to JavaScript templates for improved polyfill coverage and runtime stability

### Added

- New `templateMeta` runtime feature for all templates
  - Automatically extracts project metadata from `package.json`
  - Detects:
    - Application type (SPA / MPA)
    - Script type (TypeScript / JavaScript)
    - Style system (SCSS / Less)
    - Project version
    - Project description
  - Uses a lightweight `data-bind` mechanism for DOM injection
  - Fully framework-agnostic and works in both SPA and MPA templates

Example (SPA template):

```ts
const meta = getPackageMeta(pkg);
renderMeta(container, meta);
```

### Fixed

- Demo page styling fixes across all templates
- LESS Grid System fix in `@razerspine/pug-ui-kit`:
  - Fixed incorrect responsive recursion order
  - Prevented md classes from overriding lg
  - Media queries now generated in ascending order (sm → xl)
  - Ensures correct CSS cascade behavior

### Improved

- Cleaner demo pages with consistent visual presentation
- More production-ready default template output
- Stronger runtime metadata visibility for generated projects

---

## [1.1.0] - 2026-02-22

### Added

- SPA (Single Page Application) project type
- New `--app-type (spa | mpa)` flag
- Full SPA template matrix:
  - `spa-pug-scss-ts`
  - `spa-pug-scss-js`
  - `spa-pug-less-ts`
  - `spa-pug-less-js`
- Router-based SPA architecture
- Modular page structure for SPA templates
- i18n-ready SPA scaffold
- Updated documentation for SPA/MPA split

### Breaking

- `--app-type` flag is now required in non-interactive mode
- Internal template matrix expanded (template keys changed)
- CLI contract updated to include project architecture dimension

### Removed

- Legacy `--template` flow fully removed from documentation
- Deprecated template-oriented mental model

### Improved

- Clear separation between SPA and MPA architectures
- Stronger feature-driven CLI design
- Better long-term extensibility of template matrix
- Cleaner internal template resolution logic

### Testing

- Updated E2E tests for SPA support
- Extended feature combination validation
- Improved non-interactive coverage

---

## ⚠️ Versioning Notice

Versions `0.3.0`, `0.3.1`, and `1.0.0` are now considered **legacy pre-architecture releases**.

They introduced feature-based selection but did not include SPA/MPA separation.

---

## [1.0.0] - 2026-02-16

### Breaking

- Removed deprecated `--template` option
- Template selection is now strictly feature-based (`--style` + `--script`)
- CLI no longer supports explicit template selection

### Added

- New E2E tests:
  - partial flag validation
  - unknown option handling
- Improved CLI contract validation

### Improved

- Simplified CLI logic
- Reduced public surface API
- Fully feature-driven UX
- More robust E2E coverage

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
