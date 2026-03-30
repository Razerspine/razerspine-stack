# Razerspine Stack

[![CI](https://github.com/Razerspine/razerspine-stack/actions/workflows/ci.yml/badge.svg)](https://github.com/Razerspine/razerspine-stack/actions)
[![npm version](https://img.shields.io/npm/v/@razerspine/create-app.svg)](https://www.npmjs.com/package/@razerspine/create-app)
[![license](https://img.shields.io/npm/l/@razerspine/create-app.svg)](./LICENSE)

[![build](https://img.shields.io/badge/build-@razerspine/build-blue)](https://www.npmjs.com/package/@razerspine/build)
[![runtime](https://img.shields.io/badge/runtime-@razerspine/runtime-green)](https://www.npmjs.com/package/@razerspine/runtime)
[![ui](https://img.shields.io/badge/ui-@razerspine/ui-purple)](https://www.npmjs.com/package/@razerspine/ui)

> A modular frontend ecosystem combining a CLI generator, build system, UI layer, and reactive runtime for building scalable SPA & MPA applications without heavy frameworks.

---

## ✨ Why Razerspine Stack?

Razerspine Stack is designed for developers who want:

- 🧩 **Full control over architecture** — no hidden abstractions
- ⚡ **Modern developer experience** — fast builds, clean DX
- 🏗 **Scalable structure** — SPA & MPA support out of the box
- 🧠 **Lightweight runtime** — DI, router, reactive state without frameworks
- 🎯 **Production-first approach** — no experimental magic, only stable patterns

---

## 📦 What’s Included

- 🛠 **CLI Generator (`@razerspine/create-app`)**  
  Scaffolds production-ready projects with flexible architecture

- ⚙️ **Build System (`@razerspine/build`)**  
  Modular webpack configuration with smart defaults

- 🎨 **UI Layer (`@razerspine/ui`)**  
  Pug-based UI toolkit and reusable components

- 🧠 **Runtime (`@razerspine/runtime`)**  
  Lightweight reactive engine with:
  - Dependency Injection
  - SPA Router
  - Component lifecycle
  - Reactive state

---

## 🚀 Quick Start

```bash
npx @razerspine/create-app my-app
cd my-app
npm run dev
```

---

## Table of Contents
- [Packages](#packages)
- [Templates](#templates)
- [Application Types](#application-types)
- [Shared Packages](#shared-packages)
- [Package Manager Support](#package-manager-support)
- [Automated Hosting Support](#automated-hosting-support)
- [Architecture](#architecture)
- [Philosophy](#philosophy)
- [Development](#development)
- [Testing](#testing)
- [Template Development](#template-development)
- [Release Process](#release-process)
- [Status](#status)

---

## Packages

```text
packages/
├─ create-app    # CLI → npx @razerspine/create-app
├─ build         # Webpack configuration system
├─ ui            # Pug UI kit
├─ runtime       # SPA/MPA runtime engine
```

### Overview

- `@razerspine/create-app` → project generator (CLI)
- `@razerspine/build` → webpack abstraction layer
- `@razerspine/ui` → UI mixins and assets
- `@razerspine/runtime` → reactive runtime (DI, Router, View Engine)

All packages are:

- independently versioned
- published to npm
- used by generated projects

---

## Templates

Templates live inside the CLI package:

```text
packages/create-app/templates/
├─ mpa-pug-less-js
├─ mpa-pug-less-ts
├─ mpa-pug-scss-js
├─ mpa-pug-scss-ts
├─ spa-pug-less-js
├─ spa-pug-less-ts
├─ spa-pug-scss-js
├─ spa-pug-scss-ts
```

Templates are:

- **internal CLI assets**
- **not published to npm**
- **copied during project creation**


### Generation Flow

1. Resolve template from flags
2. Copy template files
3. Patch `package.json`
4. Install dependencies (optional)
5. Return a **fully standalone project**

---

## Application Types

### MPA (Multi Page Application)

- multiple HTML entry points
- SEO-friendly
- independent page scripts
- no client-side router

Best for:

- marketing sites
- landing pages
- static content

### SPA (Single Page Application)

- single HTML entry
- client-side routing
- component lifecycle
- reactive UI

Powered by `@razerspine/runtime`

Includes:

- Dependency Injection
- Router
- BaseComponent lifecycle
- reactive state bindings

---

## Shared Packages

Generated projects depend on:

- `@razerspine/build`
- `@razerspine/runtime`
- `@razerspine/ui`

These provide:

- webpack configuration
- build tooling
- runtime architecture
- UI helpers

Projects always use **published npm versions** (never monorepo links).

---

## Package Manager Support

The CLI supports multiple package managers:

- `npm` (default)
- `pnpm`
- `yarn`
- `bun`

Example:

```bash
npx @razerspine/create-app my-app --pm pnpm
```

Features:

- automatic script adaptation
- correct `packageManager` field
- install command abstraction

---

## Automated Hosting Support

Production builds automatically generate routing configs for:

- Netlify
- Cloudflare Pages
- Vercel
- GitHub Pages
- generic static hosting

| Platform             | Generated File      |
|----------------------|---------------------|
| Netlify / Cloudflare | `_redirects`        |
| Vercel               | `vercel.json`       |
| GitHub Pages	        | `404.html` fallback |

No manual setup required.

---

## Architecture

High-level flow:

```text
CLI
↓
Templates
↓
Generated Project
↓
Shared Packages (runtime / build / ui)
↓
Webpack Build
↓
Static Hosting
```

Key idea:

> CLI is a generator, not part of runtime.

---

## Philosophy

### Separation of Responsibilities

#### CLI

- user interaction
- template resolution
- file generation
- dependency installation

#### Templates

- project structure
- source code
- configuration
- dependencies

#### Shared Packages

- runtime logic
- build system
- UI layer


### Standalone Output

Generated projects are:

- fully independent
- framework-free
- not coupled to CLI
- production-ready

---

## Development

This repository uses **npm workspaces**.

### Install dependencies

```bash
npm install
```

### Build all packages

```bash
npm run build
```

### Run CLI locally

```bash
npm run create-app -- my-app
```

---

## Testing

The project uses a **multi-layer testing** strategy:

- unit tests
- integration tests
- E2E tests

### Run all tests

```bash
npm run test
```

### CLI tests

```bash
npm run test:cli
```

### What is tested

- CLI behavior
- template generation
- filesystem output
- package manager support
- runtime/build correctness

---

## Template Development

Templates are internal and must remain clean.

### Install template dependencies (dev only)

```bash
npm run templates:install
```

### Clean templates

```bash
npm run templates:clean
```

Removes:

- `node_modules`
- `dist`
- `lock files`

---

## Release Process

Publishing is:

- manual
- CI-validated
- OIDC-secured (no tokens)

See:

- `docs/release.md`
- `docs/release-checklist.md`

---

## Status

This monorepo is actively maintained and serves as the source of truth for:

- CLI generator
- official templates
- runtime architecture
- webpack build system

---

## Summary

This project provides:

- a **modern CLI generator**
- a **structured frontend architecture**
- a **lightweight runtime (no frameworks)**
- a **production-ready build system**

All designed for:

- flexibility
- control
- long-term maintainability
