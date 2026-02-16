# Testing

This project uses **end-to-end (E2E) tests** to validate real CLI behavior.

Since this is a CLI tool, correctness is defined by:

- filesystem side effects
- argument validation
- template resolution
- real process execution

---

## Test Structure

```
e2e/
├── basic.test.js
├── partial-flags.test.js
├── dry-run.test.js
├── unknown-option.test.js
├── style-script.test.js
├── constants/
│   └── temp-prefix.js
├── helpers/
│   ├── run-cli.js
│   ├── temp-dir.js
│   └── cleanup.js
└── package.json
```

---

## What Is Tested

### Core Behavior

- Basic project creation
- Feature-based template resolution
- `--style` + `--script` validation
- Partial flag rejection
- Unknown option handling
- `--dry-run` behavior

### Validation Rules

- `--style` and `--script` must be provided together
- Unknown flags cause the CLI to exit with an error
- Template resolution is fully feature-driven

---

## Testing Principles

- CLI is invoked exactly like a user would via `node dist/index.js`
- No internal module imports are used
- Tests run in isolated temporary directories
- CLI arguments represent project names, not absolute paths
- Working directory (`cwd`) controls where projects are created

---

## Temporary Directories

All test-created directories use the prefix:

```
create-webpack-starter-*
```

A cleanup script removes stale directories from `/tmp`
before and after test execution.

---

## Running Tests

```bash
npm run test:e2e
```

This command:

1. Cleans up old temporary directories
2. Builds the CLI
3. Runs all E2E tests sequentially
4. Cleans up again after completion

---

## Why E2E Only?

CLI correctness is behavioral.

Unit tests cannot guarantee:

- correct argument parsing
- real template copying
- actual filesystem results
- proper process exit codes

E2E tests ensure real-world usage remains stable over time.
