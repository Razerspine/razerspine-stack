# create-webpack-starter

[![npm version](https://img.shields.io/npm/v/create-webpack-starter.svg)](https://www.npmjs.com/package/create-webpack-starter)
[![changelog](https://img.shields.io/badge/docs-changelog-blue.svg)](./CHANGELOG.md)
[![license](https://img.shields.io/npm/l/create-webpack-starter.svg)](./LICENSE)

Scaffold a modern webpack project using production-ready SPA or MPA templates powered by the **frontend ecosystem**

**Built on top of**:

- `@razerspine/webpack-core`
- `@razerspine/pug-ui-kit`
- `@razerspine/starter-core-scripts`

> ⚠️ Versions prior to 1.1.0 do not include SPA support.

---

## 🚀 Quick Start

```bash
npx create-webpack-starter my-app
```

**Starts an interactive setup where you choose**:

- Project type (SPA or MPA)
- Style preprocessor (SCSS or Less)
- Script language (JavaScript or TypeScript)

---

## ⚙️ Non-interactive Usage (Recommended for CI)

```bash
npx create-webpack-starter my-app \
  --app-type mpa \
  --style scss \
  --script ts \
  --no-install
```

All feature flags must be provided together in non-interactive mode.

---

## 🧩 Options

| Option                    | Description                        |
|---------------------------|------------------------------------|
| `--app-type <spa \| mpa>` | Project architecture type          |
| `--style <scss \| less>`  | CSS preprocessor                   |
| `--script <js \| ts>`     | Script language                    |
| `--no-install`            | Skip dependency installation       |
| `--dry-run`               | Show actions without writing files |
| `-v`, `--version`         | Show CLI version                   |

---

## 🏗 Project Architectures

### SPA (Single Page Application)

**SPA templates include**:

- Built-in `Router` (Singleton pattern)
- `BaseComponent` lifecycle
- Proxy-based reactive state
- Automatic mount → render → bind → update orchestration
- Declarative navigation (`data-link`)
- Programmatic navigation (`Router.navigate()`)

### SPA Lifecycle

```text
Route change
  ↓
destroy() previous component
  ↓
new Page(root)
  ↓
mount()
  ↓
render()
  ↓
bind events
  ↓
update()
  ↓
onInit()
```

**Memory safety is handled automatically via**:

- cleanup registry
- Proxy disconnect
- delegated event binding

### Best for:

- dashboards
- admin panels
- applications
- client-side routed projects

---

### MPA (Multi Page Application)

MPA templates use the same reactive engine but without Router.

**Includes**:

- Multi-entry webpack setup
- Independent page scripts
- Proxy-based reactivity via `createStore`
- Manual binding with `applyBindings`
- Optional delegated events via `bindClickEvents` and `bindForms`

### Best for:

- landing pages
- marketing sites
- traditional multipage websites

---

## 📦 Template Resolution

Templates are resolved automatically based on selected features.

**Example combinations**:

| Type | Style | Script | Internal Template Key |
|------|-------|--------|-----------------------|
| SPA  | SCSS  | TS     | `spa-pug-scss-ts`     |
| SPA  | SCSS  | JS     | `spa-pug-scss-js`     |
| SPA  | Less  | TS     | `spa-pug-less-ts`     |
| SPA  | Less  | JS     | `spa-pug-less-js`     |
| MPA  | SCSS  | TS     | `mpa-pug-scss-ts`     |
| MPA  | SCSS  | JS     | `mpa-pug-scss-js`     |
| MPA  | Less  | TS     | `mpa-pug-less-ts`     |
| MPA  | Less  | JS     | `mpa-pug-less-js`     |

Users never select template names directly.
The CLI resolves the correct template internally.

---

## 📁 Generated Project Structure

### Example (SPA):

```text
src/
  assets/
    scripts/
      app.ts
      routes.ts
  views/
    layout/
    pages/
  types/
webpack.config.js
tsconfig.json
postcss.config.js
```

### Example (MPA):

```text
src/
  assets/
  views/
    layout/
    pages/
webpack.config.js
```

**Generated projects are**:

- Fully standalone
- Not coupled to the CLI
- Ready for production builds
- Safe to deploy immediately

---

## 🎁 What You Get

- Production-grade webpack configuration
- Pug template system
- SCSS or Less support
- JavaScript or TypeScript support
- SPA Router (SPA mode)
- Reactive View Engine (SPA & MPA)
- Clean scalable project structure
- Memory-safe component lifecycle (SPA)
- Fully standalone output

---

## 📚 Documentation

Detailed documentation is available in the `/docs` directory:

- [Getting Started](https://github.com/Razerspine/webpack-starter-monorepo/blob/main/packages/create-webpack-starter/docs/getting-started.md)
- [Templates](https://github.com/Razerspine/webpack-starter-monorepo/blob/main/packages/create-webpack-starter/docs/templates.md)
- [SPA Examples](https://github.com/Razerspine/webpack-starter-monorepo/blob/main/packages/create-webpack-starter/docs/spa-examples.md)
- [MPA Examples](http://github.com/Razerspine/webpack-starter-monorepo/blob/main/packages/create-webpack-starter/docs/mpa-examples.md)
- [webpack-core](https://github.com/Razerspine/webpack-starter-monorepo/blob/main/packages/create-webpack-starter/docs/webpack-core.md)
- [FAQ](https://github.com/Razerspine/webpack-starter-monorepo/blob/main/packages/create-webpack-starter/docs/faq.md)
- [Testing](https://github.com/Razerspine/webpack-starter-monorepo/blob/main/packages/create-webpack-starter/docs/testing.md)

---

## 🧪 Testing

This project uses real end-to-end tests to verify:

- project scaffolding
- flag-based resolution
- dry-run behavior
- invalid combinations handling
- filesystem correctness

Tests simulate real `npx` usage.

---

## 📋 Requirements

- Node.js >= 18
- npm / pnpm / yarn

---

## 🛠 How It Works

1. CLI validates selected flags
2. Internal template is resolved
3. Files are copied
4. Dependencies are installed (unless disabled)
5. Project is ready to run

---

## 📄 License

This project is licensed under the ISC License.
