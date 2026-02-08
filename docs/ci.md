## CI

### Overview

CI runs on **GitHub Actions** and validates every change to `main` via:

* build
* E2E tests

### Triggers

* `push` to `main`
* `pull_request` targeting `main`

### CI Responsibilities

* install dependencies using npm workspaces
* build all packages
* run CLI E2E tests

### What CI Does NOT Do

* publish packages
* modify versions
* generate artifacts

CI is a **validation gate only**.
