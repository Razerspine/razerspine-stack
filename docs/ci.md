# CI

## Overview

CI runs on **GitHub Actions** and acts as a quality gate for all changes to `main`.

It validates the entire monorepo, including:

- build system
- runtime engine
- UI package
- CLI generator

---

## Triggers

CI is executed on:

- `push` to `main`
- `pull_request` targeting `main`

---

## Node.js Matrix

CI is tested across multiple Node.js versions:

```text
20.x
22.x
24.x
```

This ensures compatibility with current and upcoming LTS environments.

---

## CI Responsibilities

The pipeline performs the following steps:

### 1. Install Dependencies
  - Uses npm workspaces
  - Caches dependencies for faster builds
  ```bash
  npm install
  ```

### 2. Security Audit

Runs a production-only audit:

```bash
npm audit --omit=dev --audit-level=high
```

- Fails CI on high-severity vulnerabilities
- Ignores devDependencies

### 3. Build All Packages

Builds the entire monorepo:

```bash
npm run build
```


This includes:

- `@razerspine/build`
- `@razerspine/runtime`
- `@razerspine/ui`
- `@razerspine/create`

### 4. Test Suites

CI runs **package-specific test pipelines** to ensure isolation and correctness.

#### Build System Tests

```bash
npm run test:build
```


Validates:

- webpack configuration
- template compilation
- production builds

#### Runtime Tests

```bash
npm run test:runtime
```

Validates:

- DI container
- Router
- reactive system
- component lifecycle

Includes:

- unit tests
- E2E scenarios

#### UI Package Tests

```bash
npm run test:ui
```

Validates:

- component rendering
- snapshot consistency
- integration behavior

#### CLI Tests

```bash
npm run test:cli
```

Validates:

- argument parsing
- template resolution
- filesystem operations
- package manager support (`npm`, `pnpm`, `yarn`, `bun`)
- full E2E flows

Includes:

- unit tests
- integration tests
- E2E tests

---

## What CI Does NOT Do

CI intentionally does not perform:

- package publishing
- version bumping
- changelog generation
- artifact deployment

These steps are handled manually or via separate release workflows.

---

## Design Principles

### Full Monorepo Validation

Every package is tested in isolation but within the same pipeline.

### Deterministic Builds

- Clean **install** on every run
- No reliance on local state
- Reproducible results across environments

### Fail-Fast Disabled

```yaml
fail-fast: false
```

- All Node versions run independently
- Failures are reported across the full matrix

### Real CLI Testing

CLI is tested via real execution:

- spawns processes
- creates projects
- validates filesystem output

---

## Summary

CI ensures that:

- all packages build correctly
- runtime behavior is stable
- CLI works in real-world scenarios
- cross-version Node compatibility is maintained

It acts as a **strict validation layer** before any changes reach production.
