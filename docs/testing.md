# Testing

## Strategy

This repository uses a **multi-layer testing strategy**:

- **Unit tests** → validate isolated logic
- **Integration tests** → validate interaction between modules
- **End-to-End (E2E) tests** → validate real CLI behavior

Each layer serves a specific purpose and together ensures full system reliability.

--- 

## Test Types

### Unit Tests

Validate isolated parts of the system:

- CLI argument parsing
- pipeline logic
- utilities (e.g. package.json patching, PM detection)
- individual steps (copy, install, resolve, etc.)

Fast and deterministic.

### Integration Tests

Validate interactions between components:

- dependency installation (installDeps)
- app creation pipeline
- process spawning behavior

Focus on **real execution paths with controlled mocks**.

### End-to-End (E2E) Tests

E2E tests validate **real CLI usage**, exactly as a user would run it.

They verify:

- filesystem side effects
- template copying
- argument validation
- template resolution
- package manager behavior
- process exit codes

CLI is executed via real Node process (e.g. `tsx` or built output).

---

## E2E Scope

E2E tests cover:

- basic project creation (SPA / MPA)
- feature-based template resolution
- `--app-type`, `--style`, `--script` validation
- partial flag rejection
- invalid value handling
- unknown option handling
- `--dry-run` behavior
- `--no-install` behavior
- `--pm` support:
  - `npm`
  - `pnpm`
  - `yarn`
  - `bun`

---

## Test Structure

```text
tests/
├── e2e/
├── integration/
├── unit/
├── helpers/
```

### E2E

- full CLI execution
- real filesystem validation

### Integration

- module interaction tests
- controlled environment with mocks


### Unit
- isolated logic validation

### Helpers

- CLI runner
- temp directory utilities
- cleanup scripts
- global setup

---

## Temporary Directories

All E2E tests create projects in OS temporary directories.

Prefix:

```text
create-app-*
```

Utilities:

- `createTempDir()`
- `cleanupDirectory()`
- global cleanup before/after tests

This ensures:

- isolation between tests
- no leftover artifacts
- reproducible results

---

## Running Tests

### Run all tests

```bash
npm run test
```

### Run by scope

```bash
npm run test:cli          # CLI (unit + integration + e2e)
npm run test:runtime      # runtime package
npm run test:build        # build package
npm run test:ui           # UI package
```

### Run specific layers

```bash
vitest run tests/unit
vitest run tests/integration
vitest run tests/e2e
```

### Execution Flow

Typical test run:

- Cleanup temp directories
- Build required packages (if needed)
- Execute tests
- Cleanup again


### Testing Principles

- CLI is tested as a **black box**
- No reliance on internal implementation details in E2E
- Real filesystem operations are validated
- Tests are isolated and repeatable
- Failures reflect real user scenarios

### Why Not E2E Only?

Unlike earlier versions, the project now uses **layered testing** because:

- Unit tests catch logic errors early
- Integration tests validate boundaries
- E2E ensures real-world correctness

This balance provides:

- speed
- reliability
- confidence in releases

---

## Summary

Testing guarantees that:

- CLI behaves correctly in real usage
- templates are generated properly
- package managers work as expected
- runtime and build systems remain stable

It is a **core part of the architecture**, not an afterthought.
