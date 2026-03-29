# @razerspine/create

[![npm version](https://img.shields.io/npm/v/@razerspine/create.svg)](https://www.npmjs.com/package/@razerspine/create)
[![Vitest](https://img.shields.io/badge/Vitest-62_passed-success?logo=vitest)]()
[![changelog](https://img.shields.io/badge/docs-changelog-blue.svg)](./CHANGELOG.md)
[![license](https://img.shields.io/npm/l/@razerspine/create.svg)](./LICENSE)

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
- [Changelog (1.0.0)](#changelog-100)
- [Documentation](#documentation)
- [License](#license)

---

## Quick Start

```bash
npx @razerspine/create my-app
```

or using npm script locally:

```bash
npm run create -- my-app
```

---

## CLI Usage

### Interactive mode

```bash
npx @razerspine/create my-app
```

Prompts:

- App type (SPA / MPA)
- Style (SCSS / Less)
- Script (JS / TS)

---

### Non-interactive mode (CI-friendly)

```bash
npx @razerspine/create my-app \
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
npx @razerspine/create my-app --pm pnpm
```

Supported:

- npm (default)
- pnpm
- yarn
- bun

### Features

- Auto script adaptation:
  - `npm run build` → `pnpm build` / `yarn build`
- Adds `packageManager` field to `package.json`
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

Pipeline-based architecture:

```text
resolve template
  ↓
prepare directory
  ↓
copy files
  ↓
patch package.json
  ↓
install dependencies
```

---

## Changelog (1.0.0)

### Major Release

- Full CLI rewrite
- New package: `@razerspine/create`
- New command: `create`

---

### ⚠️ Breaking Changes

- `create-webpack-starter` → `create`
- New binary: `dist/index.js`
- Switched to `tsup`
- Removed direct package.json imports

---

### Features

- Interactive CLI (inquirer)
- Smart template resolution
- Dry-run mode
- Improved validation

---

### Package Manager Support

- Added `--pm` flag
- Supports: npm, pnpm, yarn, bun
- Script auto-adaptation
- Injects `packageManager` field

---

### Testing

- Vitest migration
- Full E2E coverage
- Fixed cleanup race conditions

---

### Architecture

- Pipeline-based system
- Clean separation:
  - CLI
  - core
  - steps
  - utils

---

### DX Improvements

- `tsx` instead of `ts-node`
- Better logs (ora + kleur)
- Improved CLI UX

---

## Documentation

Detailed documentation is available in the `/docs` directory:

- [Getting Started](https://github.com/Razerspine/webpack-starter-monorepo/blob/main/packages/create/docs/getting-started.md)
- [Templates](https://github.com/Razerspine/webpack-starter-monorepo/blob/main/packages/create/docs/templates.md)
- [SPA Examples](https://github.com/Razerspine/webpack-starter-monorepo/blob/main/packages/create/docs/spa-examples.md)
- [MPA Examples](http://github.com/Razerspine/webpack-starter-monorepo/blob/main/packages/create/docs/mpa-examples.md)
- [Build System](https://github.com/Razerspine/webpack-starter-monorepo/blob/main/packages/create/docs/build-system.md)
- [Runtime Engine](https://github.com/Razerspine/webpack-starter-monorepo/blob/main/packages/create/docs/runtime-engine.md)
- [FAQ](https://github.com/Razerspine/webpack-starter-monorepo/blob/main/packages/create/docs/faq.md)
- [Testing](https://github.com/Razerspine/webpack-starter-monorepo/blob/main/packages/create/docs/testing.md)

---

## License

ISC License
