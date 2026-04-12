# @razerspine/create-app

[![npm version](https://img.shields.io/npm/v/@razerspine/create-app.svg)](https://www.npmjs.com/package/@razerspine/create-app)
[![CI](https://github.com/Razerspine/razerspine-stack/actions/workflows/ci.yml/badge.svg)](https://github.com/Razerspine/razerspine-stack/actions)
[![changelog](https://img.shields.io/badge/docs-changelog-blue.svg)](./CHANGELOG.md)
[![license](https://img.shields.io/npm/l/@razerspine/create-app.svg)](./LICENSE)

Create a modern webpack project using production-ready **SPA or MPA templates** powered by the Razerspine ecosystem.

---

## Table of Contents

- [Quick Start](#quick-start)
- [CLI Usage](#cli-usage)
- [CLI Options](#cli-options)
- [Package Manager Support](#package-manager-support)
- [Project Architectures](#project-architectures)
- [Project Structure](#project-structure)
- [Template Resolution](#template-resolution)
- [Testing](#testing)
- [How It Works](#how-it-works)
- [Changelog](#changelog)
- [Documentation](#documentation)
- [License](#license)

---

## Quick Start

```bash
npx @razerspine/create-app my-app
```

or using npm script locally:

```bash
npm run create-app -- my-app
```

---

## CLI Usage

### Interactive mode

```bash
npx @razerspine/create-app my-app
```

Prompts:

- App type (SPA / MPA)
- Style (SCSS / Less)
- Script (JS / TS)

---

### Non-interactive mode (CI-friendly)

```bash
npx @razerspine/create-app my-app \
  --app-type spa \
  --style scss \
  --script ts \
  --pm pnpm \
  --no-install
```

> ⚠️ All feature flags must be provided together.

---

## CLI Options

| Option                            | Description                  |                                               
|-----------------------------------|------------------------------|
| `--app-type spa \| mpa `          | Application architecture     |                                             
| `--style scss \| less`            | CSS preprocessor             |                                    
| `--script js \| ts`               | Script language              |                                  
| `--pm npm \| yarn \| pnpm \| bun` | Package manager to use       |                                          
| `--no-install`                    | Skip dependency installation |                                             
| `--dry-run`                       | Do not write files           |                                               
| `-v`, `--version`                 | Show CLI version             |                                             
| `-h`, `--help`                    | Show help                    |                                               

---

## Package Manager Support

You can explicitly choose a package manager:

```bash
npx @razerspine/create-app my-app --pm pnpm
```

Supported:

- npm (default)
- pnpm
- yarn
- bun

### Features

- Auto script adaptation:
  - `npm run build` → `pnpm build` / `yarn build`
- Injects exact `packageManager` version into `package.json` (corepack-compatible, e.g. `pnpm@9.1.0`)
- Fallback to `npm` if not specified

---

## Project Architectures

### SPA (Single Page Application)

Powered by:

- `@razerspine/runtime`

Includes:

- DI container
- Router
- Route guards
- Reactive state
- Component lifecycle

---

### MPA (Multi Page Application)

Features:

- Multi-entry webpack setup
- Independent pages
- Lightweight architecture

Best for:

- landing pages
- marketing sites
- classic websites

---

## Project Structure

Example:

```text
src/
  app/
  pages/
  shared/
  assets/
  styles/
```

Projects are:

- standalone
- production-ready
- deployable out of the box

---

## Template Resolution

Templates are resolved automatically:

| Type | Style | Script | Template        |
|------|-------|--------|-----------------|
| SPA  | SCSS  | TS     | spa-pug-scss-ts |
| SPA  | SCSS  | JS     | spa-pug-scss-js |
| SPA  | Less  | TS     | spa-pug-less-ts |
| SPA  | Less  | JS     | spa-pug-less-js |
| MPA  | SCSS  | TS     | mpa-pug-scss-ts |
| MPA  | SCSS  | JS     | mpa-pug-scss-js |
| MPA  | Less  | TS     | mpa-pug-less-ts |
| MPA  | Less  | JS     | mpa-pug-less-js |

---

## Testing

Includes:

- ✅ E2E tests (CLI behavior)
- ✅ Integration tests (pipeline, installer)
- ✅ Unit tests (utils, steps, CLI)

Highlights:

- Real CLI execution via `tsx`
- Temp directories per test
- Automatic cleanup
- Exit code validation
- Timeout protection

---

## How It Works

The CLI resolves and loads the template before the pipeline starts, then passes the ready template object directly into
the first step:

```text
CLI layer
  resolve template (TemplateService — single load)
  ↓
Pipeline
  prepare directory
  ↓
  copy files
  ↓
  patch package.json
  ↓
  write .gitignore
  ↓
  install dependencies
```

---

## Changelog

### [1.0.2] — Latest

- Added automatic `.gitignore` generation for every scaffolded project (`node_modules/`, `dist/`, `.env*`, logs, editor dirs)
- Fixed `packageManager` field: now injects exact version (e.g. `pnpm@9.1.0`) instead of invalid `@latest`
- Fixed `bun.lock` (Bun 1.2+) being copied into generated projects
- Fixed signal-terminated install process reporting misleading `"exit code null"`
- Fixed `JSON.parse()` in template loader and package patcher — now surfaces file path on error
- Fixed `validateRawArgs` skipping checks for 0 or 2+ positional arguments
- Fixed top-level `run().then()` no-op — replaced with `.catch()`
- Improved Windows install: `shell: false` + `.cmd` suffix instead of `shell: true`
- Refactored template resolution: single `TemplateService` load per session, removed redundant `resolveTemplateStep`

### [1.0.0] — Major Release

- Full CLI rewrite
- New package: `@razerspine/create-app`
- New command: `create`
- Interactive CLI (inquirer)
- Smart template resolution
- Dry-run mode, `--pm` flag
- Vitest migration, full E2E coverage
- Pipeline-based architecture

---

## Documentation

Detailed documentation is available in the `/docs` directory:

- [Getting Started](https://github.com/Razerspine/razerspine-stack/blob/main/packages/create-app/docs/getting-started.md)
- [Templates](https://github.com/Razerspine/razerspine-stack/blob/main/packages/create-app/docs/templates.md)
- [SPA Examples](https://github.com/Razerspine/razerspine-stack/blob/main/packages/create-app/docs/spa-examples.md)
- [MPA Examples](http://github.com/Razerspine/razerspine-stack/blob/main/packages/create-app/docs/mpa-examples.md)
- [Build System](https://github.com/Razerspine/razerspine-stack/blob/main/packages/create-app/docs/build-system.md)
- [Runtime Engine](https://github.com/Razerspine/razerspine-stack/blob/main/packages/create-app/docs/runtime-engine.md)
- [FAQ](https://github.com/Razerspine/razerspine-stack/blob/main/packages/create-app/docs/faq.md)
- [Testing](https://github.com/Razerspine/razerspine-stack/blob/main/packages/create-app/docs/testing.md)

---

## License

ISC License
