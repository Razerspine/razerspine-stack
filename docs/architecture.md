## Architecture

### Purpose

This repository is a **monorepo** that hosts:

* a public CLI (`create-webpack-starter`)
* official project templates
* shared internal packages (e.g. `webpack-core`, `pug-ui-kit`)

The monorepo exists to ensure:

* consistent development experience
* shared tooling and conventions
* atomic changes across related packages

### Core Principles

**Strict separation of responsibilities**

* CLI handles:

  * user interaction (prompts, flags)
  * template selection
  * file copying
  * dependency installation

* Templates handle:

  * full project structure
  * dependencies
  * webpack configuration
  * assets and source code

Generated projects have **no runtime dependency** on the CLI.

### Package Types

* `create-webpack-starter` – published CLI
* `templates/*` – source templates (not npm packages)
* `webpack-core` – shared webpack logic (npm package)
* `pug-ui-kit` – UI assets & mixins (npm package)
