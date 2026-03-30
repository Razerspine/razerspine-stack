# Release & Publish Process

This document describes how package publishing works in this repository
and why it is intentionally designed this way.

---

## Publish Workflow Philosophy

The publish process is **manual, guarded, and intentional**.

We explicitly avoid:

- auto-publish on `main`
- tag-based automation
- long-lived npm tokens

Instead, we use:

- manual trigger (`workflow_dispatch`)
- full CI verification before publish

This approach prioritizes:

- correctness
- security
- release awareness

---

## Why Publishing is Manual

Publishing to npm is **irreversible**.

Manual control ensures that:

- version bump is intentional
- changelog is reviewed
- CI is fully green
- release is verified by a human

This mirrors a local `npm publish` **workflow**, but with CI guarantees.

---

## CI as a Release Gate

Before any release:

CI must pass across all packages:

- `@razerspine/build`
- `@razerspine/runtime`
- `@razerspine/ui`
- `@razerspine/create-app`

CI validates:

- builds
- unit tests
- integration tests
- E2E tests
- cross-version Node.js compatibility

A failed CI = **no release**.

---

## Authentication Strategy (OIDC)

We do not store npm tokens in GitHub.

Instead, publishing uses:

- npm login session
- browser confirmation
- 2FA enforcement

### Benefits

- no secrets in repository
- no token rotation
- aligned with npm best practices
- same security model as local publishing

---

## What Gets Published

Each package controls its published output via `package.json`.

### Included

- `dist/`
- `bin/` (for CLI)
- `README.md`
- `LICENSE`
- `CHANGELOG.md`
- files listed in `"files"`

### Excluded

- tests (`tests/`, `e2e/`)
- templates source (CLI internal)
- monorepo configs
- `node_modules`
- development artifacts

---

## Responsibility Split-

| Concern         | Responsible |
|-----------------|-------------|
| Version bump    | Human       |
| Changelog       | Human       |
| Build           | CI          |
| Tests           | CI          |
| Publish trigger | Human       |
| Authentication  | npm         |

---

## Release Order

When releasing packages, **dependency order matters**.

### Correct order:

1. `@razerspine/runtime`
2. `@razerspine/build`
3. `@razerspine/ui`
4. Update template dependency versions
5. `@razerspine/create-app`

### Why this order?

- Templates depend on published packages
- CLI depends on templates referencing correct versions
- Prevents broken installs for end users

---

## Template Dependency Rule

Templates must **always reference published versions**:

```json
{
  "@razerspine/runtime": "^1.x.x",
  "@razerspine/build": "^1.x.x",
  "@razerspine/ui": "^1.x.x"
}
```

Never use:

- `workspace:*`
- `file:`
- local paths

---

## Release Checklist

Before publishing any package:

- Version updated in `package.json`
- `CHANGELOG.md` updated
- CI is green
- Build output verified (`dist/`)
- Correct package order respected

---

## Summary

This release process is:

- **manual** → prevents accidental publishes
- **secure** → no tokens, OIDC-based auth
- **deterministic** → CI-validated
- **modular** → respects package boundaries

It is intentionally **boring**, **explicit**, **and safe** - which is exactly what you want for package publishing.
