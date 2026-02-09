# webpack-starter-monorepo

Monorepo for the `create-webpack-starter` CLI and official webpack starter templates.

This repository contains everything needed to generate and maintain
production-ready webpack projects with Pug, SCSS/Less, JavaScript or TypeScript.

---

## Packages

```text
packages/
├─ create-webpack-starter    # CLI — npx create-webpack-starter
├─ webpack-core              # Shared webpack configuration & loaders
└─ pug-ui-kit                # Optional Pug UI helpers (mixins, styles)
```

---

## Templates

```text
templates/
├─ pug-less-js
├─ pug-less-ts
├─ pug-scss-js
└─ pug-scss-ts
```

---

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
