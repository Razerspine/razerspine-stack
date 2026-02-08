## Testing

### Test Strategy

This repository uses **end-to-end (E2E) testing** for the CLI.

Unit tests are intentionally avoided for CLI behavior, as correctness is defined by:

* filesystem side-effects
* real dependency installation
* real template copying

### E2E Scope

E2E tests validate:

* basic project creation
* template selection
* `--dry-run` behavior
* invalid template handling

### Temporary Directories

Tests create projects in OS temp directories using a fixed prefix:

```
create-webpack-starter-*
```

A cleanup helper removes all matching directories before and after test runs.

### Commands

```bash
npm run test:e2e
```

This command:

1. Cleans temp directories
2. Runs all E2E tests sequentially
3. Cleans temp directories again
