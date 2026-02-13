# Release & Publish Process

This document describes how package publishing works in this repository
and why it is intentionally designed this way.

---

## Publish workflow philosophy

The publish process in this repository is **manual, guarded, and intentional**.

We explicitly avoid:

- auto-publish on `main`
- tag-based automation
- token-based npm authentication

Instead, we use:

- manual trigger (`workflow_dispatch`)
- full CI verification before publish
- npm **OIDC / session-based authentication**

This approach favors correctness, security, and human awareness over speed.

---

## Why publish is manual

Publishing an npm package is **irreversible**.

A manual trigger ensures that:

- the version bump was intentional
- the changelog was reviewed and updated
- CI is fully green
- the author is present and aware of the release

This mirrors how `npm publish` normally works locally.

---

## Why OIDC instead of npm tokens

npm classic tokens are deprecated and discouraged.

This repository uses:

- GitHub Actions OIDC
- browser-based npm confirmation
- enforced 2FA / session-based authentication

### Benefits

- no secrets stored in GitHub
- no token rotation
- same security level as local `npm publish`
- future-proof with npm’s official direction

---

## What is verified before publish

Before `npm publish` runs, CI ensures:

1. Dependencies are installable
2. All workspace packages build successfully
3. CLI end-to-end tests pass
4. The version **does not already exist on npm**

If **any step fails**, publishing is blocked.

---

## What gets published

Only files explicitly allowed by the package configuration are published.

Included:

- files listed in `package.json → files`
- `bin/`
- `dist/`
- `README.md`
- `LICENSE`
- `CHANGELOG.md`

Not included:

- `e2e/`
- template sources
- `node_modules/`
- `dist/` from templates
- monorepo internals

---

## Responsibility split

| Concern | Responsible |
|------|------------|
| Version bump | Human |
| Changelog | Human |
| Build | CI |
| Tests | CI |
| Publish trigger | Human |
| Authentication | npm + browser |

---

This process is intentionally boring, explicit, and safe.

---

## Release order

When releasing shared packages:

1. Publish `starter-core-scripts`
2. Publish `webpack-core` (if changed)
3. Publish `pug-ui-kit` (if changed)
4. Update template dependency versions
5. Publish `create-webpack-starter`

Templates must reference published versions before the CLI release.
