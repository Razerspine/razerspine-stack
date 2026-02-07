# Testing

This project uses **end-to-end (E2E) tests** to verify real CLI behavior.

The goal of these tests is to simulate how a real user interacts with
`create-webpack-starter` via `npx`, including file system side effects.

---

## Test structure

```md
e2e/
├── basic.test.js # Basic project creation
├── template.test.js # Explicit template selection
├── dry-run.test.js # --dry-run behavior
├── invalid-template.test.js # Invalid template handling
├── constants/
│ └── temp-prefix.js # Prefix for temp directories
├── helpers/
│ ├── run-cli.js # Spawns CLI process
│ ├── temp-dir.js # Creates isolated temp directory
│ └── cleanup.js # Cleans up old temp directories
└── package.json
```


---

## Key principles

- Tests invoke the CLI **exactly as a user would**  
  (no direct imports of internal modules).
- CLI arguments always represent **project names**, not absolute paths.
- The working directory (`cwd`) controls where the project is created.
- Each test runs in an isolated temporary directory.
- All temporary directories share a common prefix.

---

## Temporary directories

All test-created directories use the prefix: `create-webpack-starter`
A cleanup script removes stale directories from `/tmp` before and after tests.

---

## Running tests

```bash
npm run test:e2e
```

#### This command:
* Cleans up old temp directories 
* Runs all E2E tests sequentially
* Cleans up again after completion

#### You can also run cleanup manually:

```bash
npm run test:cleanup
```

---

## Why E2E only?

Since this is a CLI tool, behavior matters more than internal structure.
E2E tests ensure that:
* prompts work
* files are created correctly
* flags behave as expected
* real-world usage remains stable over time
