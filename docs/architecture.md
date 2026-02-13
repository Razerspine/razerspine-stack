## Architecture


### 🔷 System Architecture Diagram (Mermaid)

```mermaid
flowchart TD

%% =========================
%% Generator Layer
%% =========================
subgraph L1[Generator Layer]
    CLI["create-webpack-starter CLI"]
end

%% =========================
%% Project Layer
%% =========================
subgraph L2[Project Layer]
    TEMPLATES["Templates (copied into project)"]
    PROJECT["Generated Project"]
end

%% =========================
%% Runtime Layer
%% =========================
subgraph L3[Shared Runtime Packages (published to npm)]
    CORE["@razerspine/webpack-core"]
    UI["@razerspine/pug-ui-kit"]
    SCRIPTS["@razerspine/starter-core-scripts"]
end

%% =========================
%% Build Layer
%% =========================
subgraph L4[Build Layer]
    WEBPACK["Webpack & Loaders"]
end

%% Flow
CLI -->|"copies files + runs npm install"| TEMPLATES
TEMPLATES --> PROJECT

PROJECT -->|"depends on"| CORE
PROJECT -->|"depends on"| UI
PROJECT -->|"depends on"| SCRIPTS

CORE --> WEBPACK

%% Important constraint
CLI -.->|"no runtime dependency"| PROJECT
```

---

### Architectural Boundaries

- The CLI is a generator tool and is never used at runtime.
- Templates are copied into the generated project.
- Shared runtime packages are published to npm and versioned independently.
- The generated project is fully standalone.

---

### Purpose

This repository is a **monorepo** that hosts:

- a public CLI (`create-webpack-starter`)
- official project templates
- shared internal packages (e.g. `webpack-core`, `pug-ui-kit`)

The monorepo exists to ensure:

- consistent development experience
- shared tooling and conventions
- atomic changes across related packages

---

### Core Principles

**Strict separation of responsibilities**

- CLI handles:
  - user interaction (prompts, flags)
  - template selection
  - file copying
  - dependency installation
- Templates handle:
  - full project structure
  - dependencies
  - webpack configuration
  - assets and source code

Generated projects have **no runtime dependency** on the CLI.

---

### Package Types

- `create-webpack-starter` – published CLI
- `webpack-core` – shared webpack configuration (npm package)
- `pug-ui-kit` – UI assets & mixins (npm package)
- `starter-core-scripts` – shared frontend services (npm package)
- `templates/*` – source templates (not npm packages)

--- 

### Workspace dependency model

This repository uses **npm workspaces**, which affects how and where
`node_modules` directories are created.

#### Important behavior

When running `npm install` from the repository root:

- npm builds a **single dependency graph** for all workspace packages
- dependencies are **hoisted to the root `node_modules/` whenever possible**
- individual workspace packages may **not have their own `node_modules/` directory**

This is expected and correct behavior.

#### Practical consequences

- A workspace package **can work correctly without a local `node_modules/` directory**
- Node.js resolves dependencies by walking up the directory tree to the root
- The presence or absence of `node_modules/` inside a workspace package
  is an implementation detail, not a guarantee

Example:

```text
root/
├─ node_modules/
│  └─ inquirer
├─ packages/
│  └─ create-webpack-starter/
│     └─ (no node_modules/)
```

In this case, create-webpack-starter correctly resolves inquirer
from the root node_modules.

#### Package-specific notes

- `webpack-core`
  - may have its own `node_modules` if dependencies cannot be fully hoisted
- `pug-ui-kit`
  - does not have `node_modules` because it has no runtime dependencies
- `create-webpack-starter`
  - relies on hoisted dependencies in the root workspace

This behavior is intentional and should not be “fixed”.

---

---

### Shared runtime packages

The monorepo contains shared runtime packages used by templates:

- `@razerspine/webpack-core`
- `@razerspine/pug-ui-kit`
- `@razerspine/starter-core-scripts`

These are published npm packages.

Templates declare them as normal semver dependencies
(e.g. `"^0.2.0"`), not as workspace dependencies.

This guarantees that:

- Generated projects are fully standalone
- No workspace references leak into published templates
- CLI users always receive stable, published versions

---

### Templates and dependency installation

Directories under `templates/` are **not npm workspaces**.

npm does not install dependencies for templates automatically.

Template projects receive their dependencies only when:

- the CLI copies the template into a target directory
- the CLI runs `npm install` inside the generated project

#### Local template development

During local template development, `node_modules/` and `dist/` directories
may exist inside template folders.

These directories:

- are ignored by git
- are ignored during template copying
- are never shipped to end users

This guarantees:

- clean generated projects
- predictable installs
- no leakage of local development artifacts

---

### Dependency strategy

Templates must never use:

- `workspace:*`
- `file:`
- local path references

Templates must always depend on published npm versions
of shared packages using semver ranges (e.g. `^0.2.0`).

The CLI is responsible only for copying templates
and running `npm install` in the target directory.
