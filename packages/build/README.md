# @razerspine/build

[![npm version](https://img.shields.io/npm/v/@razerspine/build.svg)](https://www.npmjs.com/package/@razerspine/build)
[![Vitest](https://img.shields.io/badge/Vitest-92_passed-success?logo=vitest)](#)
[![changelog](https://img.shields.io/badge/docs-changelog-blue.svg)](./CHANGELOG.md)
[![license](https://img.shields.io/npm/l/@razerspine/build.svg)](./LICENSE)

> **Note:** This package was formerly known as `@razerspine/webpack-core`. Starting from v1.0.0, it has been completely
> redesigned and renamed to `@razerspine/build`.

A scalable, modular, and highly extensible Webpack build system. Whether you are building template-driven MPA websites (
Pug/HTML) or modern SPA applications (React), `@razerspine/build` provides a zero-hassle, production-ready foundation
with smart auto-hosting capabilities.

---

## Table of Contents

- [Key Features](#-key-features)
- [Installation](#-installation)
- [Usage (`defineConfig`)](#-usage)
- [React Preset (Beta)](#-react-preset-beta)
- [Application Modes (SPA/MPA)](#-application-modes)
- [Template Engines](#-template-engines)
- [Extensibility (Hooks & Plugins)](#-extensibility)
- [Smart Hosting Adapter](#-smart-hosting-adapter)
- [License](#-license)

---

## 🚀 Key Features

- **New `defineConfig` API**: Single entry point for configuration with automatic mode-based resolution.
- **Multi-Engine Templates**: Built-in support for `pug`, `html`, or `none`.
- **React Support (Beta)**: DX with Fast Refresh and Babel pipeline via `reactPreset`.
- **Hybrid Architectures**: Seamlessly switch between Multi-page (MPA) and Single-page (SPA) modes.
- **Smart Auto-Hosting**: Automatically detects **Vercel, Netlify, Cloudflare**, and **GitHub Pages** to generate
  required routing configs.
- **Build Plugins Lifecycle**: Extend the build process safely using `setup`, `applyBase`, `applyDev`, and `applyProd`
  hooks.
- **Rock Solid**: Covered by 90+ Unit, Integration, E2E, and Snapshot tests.

---

## 📦 Installation

```bash
npm install -D @razerspine/build
```

---

## 📖 Usage

Creating a Webpack config is now incredibly simple thanks to the `defineConfig` helper.
It automatically handles `development` and `production` modes.

### Basic Setup (Static)

Create a `webpack.config.js`:

```js
const {defineConfig} = require('@razerspine/build');

module.exports = defineConfig({
  appType: 'spa', // 'spa' or 'mpa'
  scripts: 'ts',  // 'ts' or 'js'
  styles: 'scss', // 'scss' or 'less'
  templates: {
    type: 'pug',
    entry: 'src/app/app.pug',
  },
});
```

### Dynamic & Async Configuration

You can pass a function to `defineConfig` to access the current mode or fetch async data:

```js
const {defineConfig} = require('@razerspine/build');

module.exports = defineConfig(async ({mode}) => {
  return {
    mode,
    scripts: 'ts',
    styles: 'scss',
    // Options...
  };
});
```

---

## ⚛️ React Preset (Beta)

We've introduced a powerful React preset built on top of the new Build Plugins system.
It provides a modern developer experience out of the box.

**Features**: Babel pipeline, React Fast Refresh, automatic JSX runtime, and safe deduplication.

### 1. Install Peer Dependencies

```bash
npm install -D babel-loader @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript @pmmmwh/react-refresh-webpack-plugin react-refresh
```

### 2. Update Configuration

```js
const {defineConfig, reactPreset} = require('@razerspine/build');

module.exports = defineConfig({
  scripts: 'ts',
  styles: 'scss',
  templates: {
    type: 'none', // Handle templates manually or disable for raw React builds
  },
  presets: [
    reactPreset()
  ]
});
```

---

## 🛠 Application Modes

Configure how your application structure is processed using the `appType` option.

### MPA (Default)

`appType: 'mpa'`

- `templates.entry` must be a directory (e.g., `src/views/pages`).
- Each file in the directory generates its own HTML file.

### SPA

`appType: 'spa'`

- `templates.entry` must be a single file (e.g., `src/app/app.pug` or `index.html`).
- Always outputs `index.html`.
- Enables automatic SPA fallback routing (`404.html`) for static hosts.

---

## 📄 Template Engines

You can now explicitly control template processing via `templates.type`:

- `pug` (Default): Uses `PugTemplatesPlugin`. Dual-mode support (compiles components for JS imports, renders static HTML
  for entries).
- `html`: Uses `HtmlTemplatesPlugin` (wrapper around `html-webpack-plugin`).
- `none`: Disables template handling entirely (useful for custom setups or pure JS/React builds).

---

## 🔌 Extensibility

### Extending Rules & Plugins

You can safely extend or override internal Webpack rules and plugins without breaking the core:

```js
module.exports = defineConfig({
  // ...
  rules: {
    extend: [ /* your custom RuleSetRule */],
  },
  plugins: {
    extend: [ /* your custom WebpackPluginInstance */],
  }
});
```

### Build Plugins System (Lifecycle Hooks)

For advanced use cases or framework integrations, use the new internal plugin system:

```js
module.exports = defineConfig({
  buildPlugins: [
    {
      setup(ctx) { /* run before config creation */
      },
      applyBase(config) { /* mutate base config object safely */
      },
      applyDev(config) { /* dev-only overrides */
      },
      applyProd(config) { /* prod-only overrides */
      }
    }
  ]
});
```

---

## 🌍 Smart Hosting Adapter

The core automatically detects your CI/CD environment during the production build and emits necessary routing
configurations in-memory.

| Platform                 | Generated File | Purpose                                                                  |
|:-------------------------|:---------------|:-------------------------------------------------------------------------|
| **Netlify / Cloudflare** | `_redirects`   | Handles SPA rewrites and MPA fallbacks.                                  |
| **Vercel**               | `vercel.json`  | Configures Vercel Edge Network routing based on `appType`.               |
| **GitHub Pages**         | `404.html`     | Duplicates `index.html` to prevent 404 errors on deep links in SPA mode. |
| **Static / Others**      | `404.html`     | Generic fallback for SPA mode.                                           |

---

## 📄 License

This project is licensed under the ISC License.
