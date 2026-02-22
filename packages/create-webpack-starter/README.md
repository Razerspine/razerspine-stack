# create-webpack-starter

[![npm version](https://img.shields.io/npm/v/create-webpack-starter.svg)](https://www.npmjs.com/package/create-webpack-starter)
[![changelog](https://img.shields.io/badge/docs-changelog-blue.svg)](./CHANGELOG.md)
[![license](https://img.shields.io/npm/l/create-webpack-starter.svg)](./LICENSE)

Create a modern webpack project using production-ready SPA and MPA templates.

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

| Option                    | Description                         |
|---------------------------|-------------------------------------|
| `--app-type <spa \| mpa>` | Project architecture type           |
| `--style <scss \| less>`  | CSS preprocessor                    |
| `--script <js \| ts>`     | Script language                     |
| `--no-install`            | Skip dependency installation        |
| `--dry-run`               | Show actions without writing files  |

---

## 🏗 Project Types

### SPA (Single Page Application)

- Pug-based layout system
- Router setup included
- Modular page structure
- TypeScript-ready architecture
- i18n-ready structure
- Production-optimized webpack config

**Best for**:

- dashboards
- admin panels
- applications
- client-side routed projects

### MPA (Multi Page Application)

- Multiple independent pages
- Server-ready HTML output
- Classic multi-entry webpack setup
- SEO-friendly structure

**Best for**:

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

## 📁 Generated SPA Structure (Example)

```text
src/
  assets/
  views/
  types/
  ...
webpack.config.js
tsconfig.json
postcss.config.js
```

Templates are fully standalone.
No hidden dependencies on the CLI package.

---

## 📚 Documentation

Detailed documentation is available in the `/docs` directory:

- [Getting Started](https://github.com/Razerspine/webpack-starter-monorepo/blob/main/packages/create-webpack-starter/docs/getting-started.md)
- [Templates](https://github.com/Razerspine/webpack-starter-monorepo/blob/main/packages/create-webpack-starter/docs/templates.md)
- [webpack-core](https://github.com/Razerspine/webpack-starter-monorepo/blob/main/packages/create-webpack-starter/docs/webpack-core.md)
- [FAQ](https://github.com/Razerspine/webpack-starter-monorepo/blob/main/packages/create-webpack-starter/docs/faq.md)
- [Testing](https://github.com/Razerspine/webpack-starter-monorepo/blob/main/packages/create-webpack-starter/docs/testing.md)

---

## 📋 Requirements

- Node.js >= 18
- npm / pnpm / yarn

---

## 🛠 How It Works

1. CLI resolves template based on selected flags
2. Files are copied into target directory
3. Dependencies are installed (unless disabled)
4. Project is ready to run

---

## 🎁 What You Get

- Production-grade webpack configuration
- Pug template system
- SCSS or Less support
- JavaScript or TypeScript support
- SPA router (in SPA mode)
- Clean scalable project structure
- Fully standalone project

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

## 📄 License

This project is licensed under the ISC License.
