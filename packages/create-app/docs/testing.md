# Testing

This project uses a **multi-layer** testing strategy built on top of **Vitest**.

Since this is a CLI tool, correctness is defined by:

- filesystem side effects
- argument parsing and validation
- template resolution
- pipeline execution
- real process behavior

---

## Test Stack

- **Vitest** - test runner
- **tsx** - runtime for executing CLI in E2E tests
- Node.js APIs (`fs`, `child_process`) - mocked where needed

---

## Test Structure

```text
tests/
├── e2e/
│   ├── basic.test.ts
│   ├── spa-basic.test.ts
│   ├── style-script.test.ts
│   ├── partial-flags.test.ts
│   ├── invalid-values.test.ts
│   ├── dry-run.test.ts
│   ├── unknown-option.test.ts
│   ├── version.test.ts
│   ├── help.test.ts
│   ├── pm-flag.test.ts
│
├── integration/
│   ├── create-app.test.ts
│   ├── installer.test.ts
│
├── unit/
│   ├── cli/
│   │   ├── parse-args.test.ts
│   │
│   ├── core/
│   │   ├── pipeline.test.ts
│   │
│   ├── steps/
│   │   ├── copy-template-step.test.ts
│   │   ├── install-deps-step.test.ts
│   │   ├── patch-package-step.test.ts
│   │   ├── prepare-directory-step.test.ts
│   │   ├── resolve-template-step.test.ts
│   │
│   ├── utils/
│   │   ├── copier.test.ts
│   │   ├── detect-pm.test.ts
│   │   ├── patch-package.test.ts
│
├── helpers/
│   ├── run-cli.ts
│   ├── temp-dir.ts
│   ├── cleanup-directory.ts
│   ├── cleanup.ts
│   ├── temp-prefix.ts
│   ├── global-setup.ts
```

---

## Test Levels

### E2E (End-to-End)

E2E tests validate **real CLI behavior**.

CLI is executed via:

```ts
spawn(tsx, ['src/index.ts', ...args])
```

#### What is covered:

- project generation (SPA / MPA)
- template resolution
- CLI flags (`--app-type`, `--style`, `--script`)
- `--pm` (package manager support)
- `--dry-run`
- `--no-install`
- invalid flags and error handling
- help/version commands

#### Key principle:

> Tests simulate real user behavior — no internal imports.

### Integration Tests

Integration tests validate interaction between modules.

#### Examples:

- `createApp` pipeline execution
- dependency installation (installDeps)
- interaction between steps

#### What is mocked:

- `child_process.spawn`
- logging (optional)

#### What is real:

- function orchestration
- control flow
- error handling

### Unit Tests

Unit tests validate **isolated logic**.

#### Covered areas:

- CLI parsing (`parseCliArgs`)
- pipeline mechanics
- individual steps
- utilities:
  - `patchPackageJson`
  - `detectPackageManager`
  - file copying

#### Benefits:

- fast execution
- deterministic results
- precise failure isolation

### Package Manager Testing

The CLI supports:

- npm
- pnpm
- yarn
- bun

#### Covered in tests:

- correct command execution (`spawn`)
- script prefix transformation:
  - `npm run build` → `pnpm build`
- `packageManager` field injection
- fallback behavior (default → npm)
- invalid `--pm` handling

### CLI Validation Rules

- `--app-type`, `--style`, `--script` must be provided together in non-interactive mode
- partial flags → error
- invalid values → error
- unknown flags → error

These are verified via E2E tests.

---

## Temporary Directories

Tests run in isolated directories created via helpers.

### Example prefix:

```text
/tmp/test-create-*
```

### Behavior:

- created before each test
- removed after each test
- global cleanup runs before and after test suite

This prevents:
- test collisions
- leftover files
- flaky behavior

---

## CLI Test Helper

Custom helper:

```ts
runCLI(args, options)
```

### Features:

- runs CLI via `tsx`
- captures `stdout` / `stderr`
- validates exit codes
- supports timeout protection
- allows custom working directory

---

## Running Tests

### All tests

```bash
npm run test
```

### E2E only

```bash
npm run test:e2e
```

### Unit only

```bash
npm run test:unit
```

### Integration only

```bash
npm run test:integration
```

---

## Why Not E2E Only?

Earlier versions relied on E2E tests only.

Now the project uses **layered testing**:

| Type        | Purpose                |
|-------------|------------------------|
| Unit        | 	fast logic validation |
| Integration | 	module interaction    |
| E2E         | 	real CLI behavior     |

### Result:

- faster feedback loop
- better error isolation
- higher confidence in releases

---

## Testing Philosophy

- Test behavior, not implementation
- Prefer real execution (E2E) where it matters
- Mock only external dependencies
- Keep tests deterministic
- Ensure cleanup is always executed
