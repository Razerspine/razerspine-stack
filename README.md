# webpack-starter-monorepo

Monorepo for the `create-webpack-starter` CLI and the official webpack starter templates.

This repository contains everything required to generate **production-ready webpack projects** using:

* **Pug**
* **SCSS or Less**
* **JavaScript or TypeScript**
* **SPA or MPA architectures**

It provides a structured ecosystem consisting of a project generator, shared runtime packages, and official starter templates.

---

## Packages

```text
packages/
├─ create-webpack-starter      # CLI — npx create-webpack-starter
├─ webpack-core                # Shared webpack configuration & loaders
├─ pug-ui-kit                  # Optional Pug UI helpers
└─ starter-core-scripts        # Runtime utilities (router, DI, view bindings)
```

Each package has a clearly defined responsibility and is versioned independently.

Generated projects depend on **published npm packages**, not on this monorepo.

---

## Templates

Starter templates live inside the CLI package.

```text
packages/create-webpack-starter/templates/
├─ mpa-pug-less-js
├─ mpa-pug-less-ts
├─ mpa-pug-scss-js
├─ mpa-pug-scss-ts
├─ spa-pug-less-js
├─ spa-pug-less-ts
├─ spa-pug-scss-js
└─ spa-pug-scss-ts
```

Templates are **internal CLI assets** and are not published to npm.

When a project is generated, the CLI:

1. selects a template
2. copies the template files
3. installs dependencies
4. prepares a fully standalone project

---

## Application Types

Templates support two architectural modes.

### MPA — Multi Page Application

Characteristics:

- multiple HTML entry points
- server-friendly structure
- SEO-friendly output
- independent page scripts

Best suited for:

- marketing websites
- documentation sites
- static content projects

---

### SPA — Single Page Application

Characteristics:

- single HTML entry
- client-side routing
- component lifecycle
- application-like behavior

SPA templates include a lightweight runtime powered by:

- dependency injection
- Router
- `BaseComponent` lifecycle
- reactive state bindings

---

## Shared Runtime Packages

Templates rely on several shared runtime packages:

- `@razerspine/webpack-core`
- `@razerspine/pug-ui-kit`
- `@razerspine/starter-core-scripts`

These packages provide:

- webpack configuration
- build tooling
- runtime services
- UI utilities

They are versioned and published independently.

Generated projects always depend on **stable npm releases**, never on monorepo workspaces.

---

## Automated Hosting Support

Production builds automatically generate configuration for common static hosting platforms.

Supported environments:

- Netlify
- Cloudflare Pages
- Vercel
- GitHub Pages
- generic static hosting

Depending on the environment, the build may generate:

| Platform             | Generated File          |
|----------------------|-------------------------|
| Netlify / Cloudflare | `_redirects`            |
| Vercel               | `vercel.json`           |
| GitHub Pages         | `404.html` SPA fallback |

Hosting detection is based on environment variables automatically provided by hosting providers.

This allows **zero-configuration deployment for SPA routing**.

---

## Philosophy

This project follows a **strict separation of responsibilities**.

## CLI responsibilities

The CLI handles:

- user interaction (prompts and flags)
- template selection
- file copying
- dependency installation

The CLI **never participates in runtime execution**.

---

## Template responsibilities

Templates define:

- project structure
- dependencies
- webpack configuration
- application source code

Templates are designed to produce **fully standalone projects**.

After generation, the project belongs entirely to the user.

No runtime dependency on the CLI exists.

---

## High-Level Architecture

This monorepo separates responsibilities across layers:

```
CLI
  ↓
Templates
  ↓
Generated Project
  ↓
Runtime Packages
  ↓
Webpack Build
  ↓
Static Hosting
```

The CLI simply generates projects.

All runtime behavior lives in **published packages**, not inside the generator.

---

## Development

This repository uses **npm workspaces**.

---

## Install all dependencies

```bash
npm install
```

---

## Build all packages

```bash
npm run build
```

---

## Local CLI testing

```bash
npm run dev:cli
```

---

## CLI end-to-end tests

```bash
npm run test:e2e
```

---

## End-user usage

End users should generate projects with:

```bash
npx create-webpack-starter
```

---

# Dependency Installation Model

This monorepo uses **npm workspaces**.

When running `npm install` from the repository root:

- npm builds a unified dependency graph
- most dependencies are hoisted to the root `node_modules`
- individual packages may not contain their own `node_modules`

This behavior is expected.

Example:

```
root/
├─ node_modules/
├─ packages/
│  └─ create-webpack-starter/
│     └─ (no node_modules)
```

Node.js resolves dependencies by walking up the directory tree.

---

## Template Development Utilities

During template development it may be useful to:

- install dependencies inside templates
- test template builds
- clean development artifacts

The monorepo provides helper scripts for this workflow.

---

## Install dependencies in all templates

Installs dependencies in:

```
packages/create-webpack-starter/templates/*/files
```

Run:

```bash
npm run templates:install
```

---

## Clean template artifacts

Templates must never ship with:

- `node_modules`
- `dist`
- `package-lock.json`
- build caches

Clean all templates:

```bash
npm run templates:clean
```

---

## Important

Template directories are **not npm workspaces**.

They are:

- development sources for the CLI
- copied into generated projects
- installed only after project generation

Templates must always remain:

- clean
- dependency-free
- free of build artifacts

The CLI is responsible for running `npm install` in generated projects.

---

## Release Process

Publishing is performed via GitHub Actions.

The release pipeline includes:

- full build
- end-to-end tests
- version existence guard
- npm publishing via OIDC + 2FA

For details see:

- `docs/release.md`
- `docs/release-checklist.md`

---

## Status

This monorepo is actively maintained and serves as the **source of truth for all official webpack starter templates**.
