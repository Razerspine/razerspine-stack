# webpack-starter-monorepo

Monorepo for the `create-webpack-starter` CLI and official webpack starter templates.

This repository contains everything needed to generate and maintain
production-ready webpack projects with Pug, SCSS/Less, JavaScript or TypeScript.

---

## Dependency Overrides Policy

The monorepo currently enforces explicit overrides for:

- `glob`
- `minimatch`

These overrides align the toolchain with the latest secure dependency stack
and mitigate a transitive `minimatch` ReDoS advisory present in older `glob` versions.

Why this exists:

- `js-beautify` depends on `glob@10`
- `glob@10` pulls older `minimatch`
- Upstream has not yet updated the dependency range

This override is:

- Build-time only
- Tested for compatibility
- Safe for the current toolchain

The override will be removed once upstream packages adopt modern versions.

---

## Packages

```text
packages/
├─ create-webpack-starter      # CLI — npx create-webpack-starter
├─ webpack-core                # Shared webpack configuration & loaders
├─ pug-ui-kit                  # Optional Pug UI helpers
└─ starter-core-scripts        # Shared frontend services (theme, i18n, api)
```

---

## Templates

```text
create-webpack-starter/templates/
├─ mpa-pug-less-js
├─ mpa-pug-less-ts
├─ mpa-pug-scss-js
├─ mpa-pug-scss-ts
├─ spa-pug-less-js
├─ spa-pug-less-ts
├─ spa-pug-scss-js
└─ spa-pug-scss-ts
```

---

## Application Types

Templates may implement different architectures:

- **MPA** — multi-page static structure
- **SPA** — single entry application

The CLI resolves:

- style stack (scss / less)
- script stack (js / ts)
- application type (spa / mpa)

Each combination maps to a concrete template.

---

## Shared Runtime Packages

Templates rely on published runtime packages:

- `@razerspine/webpack-core`
- `@razerspine/pug-ui-kit`
- `@razerspine/starter-core-scripts`

These packages are versioned and published independently.

Generated projects depend on stable npm versions,
not on the monorepo workspace.

## Philosophy

This repository follows a strict separation of responsibilities.

### CLI responsibilities

- user interaction (prompts, flags)
- template selection
- file copying
- dependency installation

### Template responsibilities

- fully standalone projects
- production-ready setup
- editable after generation
- no runtime dependency on the CLI

No hidden magic.  
No runtime coupling.  
Generated projects are yours forever.

---

## High-Level Architecture

This monorepo separates concerns strictly:

- CLI → project generator only
- Templates → full project structure
- Runtime packages → shared build/runtime logic
- Generated projects → fully standalone

The CLI:

- selects a template (style + script + app type)
- copies files
- optionally applies config patches
- runs dependency installation

It never participates in runtime.

Generated projects contain no dependency on the CLI.

---

## Development

### This repository uses npm workspaces.

#### Install all workspace dependencies:
```bash
npm install
```

#### Build all packages:

```bash
npm run build
```

#### Local CLI testing:

```bash
npm run dev:cli
```

#### CLI e2e tests

```bash
npm run test:e2e
```

#### End users should use

```bash
npx create-webpack-starter
```

---

## Dependency installation model

This monorepo uses **npm workspaces**.

When running `npm install` from the repository root:

- dependencies for all workspace packages are installed together
- most dependencies are hoisted into the root `node_modules/`
- individual packages may not have their own `node_modules` directories

This is expected npm behavior and does not indicate a broken setup.

Template directories under `templates/` are **not workspaces**.
Their dependencies are installed only when the CLI generates a project
and runs `npm install` in the target directory.

> Note:
> The presence or absence of `node_modules` inside a package directory
> should not be relied upon. Always run commands from the repository root
> unless explicitly stated otherwise.

---

## Release process

Publishing is performed manually via GitHub Actions.

The release pipeline includes:

- full build
- end-to-end tests
- version existence guard
- npm publish via OIDC + 2FA

For details, see:
- `docs/release.md`
- `docs/release-checklist.md`
---

## Status
This monorepo is actively developed and used as the source of truth
for all official webpack starter templates.
