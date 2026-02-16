## Testing

### Strategy

This repository uses **end-to-end (E2E) testing** for the CLI.

Unit tests are intentionally avoided for CLI behavior.

Correctness is defined by:

- filesystem side effects
- template copying
- argument validation
- process exit codes

---

### E2E Scope

E2E tests validate:

- basic project creation
- feature-based template resolution
- partial flag validation
- unknown option handling
- `--dry-run` behavior

---

### Temporary Directories

Tests create projects in OS temporary directories
using a fixed prefix:

```
create-webpack-starter-*
```

A cleanup helper removes all matching directories
before and after test runs.

---

### Commands

```bash
npm run test:e2e
```

This command:

1. Cleans temporary directories
2. Builds the CLI
3. Runs all E2E tests sequentially
4. Cleans temporary directories again
