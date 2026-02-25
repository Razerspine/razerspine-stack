# Testing

This project uses **end-to-end (E2E) tests** to validate real CLI behavior.

Since this is a CLI tool, correctness is defined by:

- filesystem side effects
- argument validation
- template resolution
- real process execution

---

## Test Structure

```text
e2e/
├── basic.test.js
├── spa-basic.test.js
├── style-script.test.js
├── partial-flags.test.js
├── invalid-values.test.js
├── dry-run.test.js
├── unknown-option.test.js
├── version.test.js
├── help.test.js
├── constans/
│ └── temp-prefix.js
├── helpers/
│ ├── run-cli.js
│ ├── temp-dir.js
│ └── cleanup.js
└── package.json
```

---

## What Is Tested

### Core Behavior

- Basic project creation (MPA)
- SPA project creation
- Feature-based resolution
- `--app-type` validation
- `--style` + `--script` validation
- Partial flag rejection
- Invalid value rejection
- Unknown option handling
- `--dry-run` behavior

---

## Validation Rules

- `--app-type`, `--style`, and `--script` must be provided together in non-interactive mode
- Partial flags cause CLI exit
- Invalid values cause CLI exit
- Unknown flags cause CLI exit

---

## Testing Principles

- CLI is invoked exactly like a user would (`node dist/index.js`)
- No internal imports are used
- Tests run in isolated temporary directories
- Working directory controls project creation location
- Real filesystem effects are verified

---

## Temporary Directories

All test directories use prefix: `create-webpack-starter-*`


Cleanup scripts remove stale directories from `/tmp`
before and after test execution.

---

## Running Tests

```bash
npm run test:e2e
```

**This command**:

- Cleans temporary directories
- Builds the CLI
- Runs all E2E tests
- Cleans again after completion

---

## Why E2E Only?

CLI correctness is behavioral.

**Unit tests cannot guarantee**:

- real template copying
- actual filesystem output
- process exit codes
- argument parsing correctness

E2E ensures stability across Node.js versions and real-world usage.
