# @razerspine/build

[![npm version](https://img.shields.io/npm/v/@razerspine/build.svg)](https://www.npmjs.com/package/@razerspine/build)
[![CI](https://github.com/Razerspine/razerspine-stack/actions/workflows/ci.yml/badge.svg)](https://github.com/Razerspine/razerspine-stack/actions)
[![changelog](https://img.shields.io/badge/docs-changelog-blue.svg)](./CHANGELOG.md)
[![license](https://img.shields.io/npm/l/@razerspine/build.svg)](./LICENSE)

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
- [Template Data](#-template-data)
- [Extensibility (Hooks & Plugins)](#-extensibility)
- [Smart Hosting Adapter](#-smart-hosting-adapter)
- [Architecture Principles](#-architecture-principles)
- [Requirements](#-requirements)
- [License](#-license)

---

## 🚀 Key Features

- **`defineConfig` API**: Single entry point for configuration with automatic mode-based resolution.
- **Multi-Engine Templates**: Built-in support for `pug`, `html`, or `none`.
- **Template Data**: Pass global variables into all templates at compile time via `templates.data`.
- **React Support (Beta)**: DX with Fast Refresh and Babel pipeline via `reactPreset`.
- **Hybrid Architectures**: Seamlessly switch between Multi-page (MPA) and Single-page (SPA) modes.
- **Smart Auto-Hosting**: Automatically detects **Vercel, Netlify, and Cloudflare** to generate required routing
  configs.
- **Enhanced DX**: Recursive file watching (`src/**/*`), automatic browser opening, and detailed infrastructure logging.
- **Build Plugins Lifecycle**: Extend the build process safely using `setup`, `applyBase`, `applyDev`, and `applyProd`
  hooks.
- **Lazy Peer Dependencies**: `pug-plugin` and `html-webpack-plugin` are only required when actually used — no install
  errors when switching template engines.
- **Rock Solid**: Covered by 90+ Unit, Integration, E2E, and Snapshot tests.

---

## 📦 Installation

```bash
npm install -D @razerspine/build
```

Peer dependencies are optional and only required based on your template engine choice:

| Template engine         | Required peer dependency             |
|:------------------------|:-------------------------------------|
| `type: 'pug'` (default) | `npm install -D pug-plugin`          |
| `type: 'html'`          | `npm install -D html-webpack-plugin` |
| `type: 'none'`          | none                                 |

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

### DevServer & Production Overrides

Use `devServer` to configure the Webpack Dev Server, and `prod` to override production Webpack options.
Both fields are optional and only applied in their respective modes.

```js
const {defineConfig} = require('@razerspine/build');

module.exports = defineConfig({
  scripts: 'ts',
  styles: 'scss',

  // Merged on top of the default devServer config (development only)
  devServer: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },

  // Merged last into the production config — takes priority over internal defaults
  prod: {
    optimization: { minimize: false },
    performance: { hints: 'warning' },
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

We've introduced a powerful React preset built on top of the Build Plugins system.
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
    type: 'none',
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

Control template processing via `templates.type`:

- `pug` (Default) — uses `PugTemplatesPlugin`. Dual-mode: compiles Pug files imported from JS/TS as functions, renders
  entry files as static HTML.
- `html` — uses `HtmlTemplatesPlugin` (wrapper around `html-webpack-plugin`).
- `none` — disables template handling entirely (useful for React/Vue or custom setups).

---

## 🗂 Template Data

Pass global variables into all templates at compile time via `templates.data`.

### Pug templates

Supports both `object` (static) and `string` path to a JSON/JS file (HMR-friendly):

```js
module.exports = defineConfig({
  templates: {
    type: 'pug',
    entry: 'src/views/pages',
    data: {
      siteName: 'My App',
      version: process.env.npm_package_version,
    },
    // HMR-friendly alternative — webpack watches the file for changes:
    // data: './src/data/site.json',
  }
});
```

Usage in Pug template:

```pug
title= siteName
p Version: #{version}
```

> When using a string path, webpack detects changes and recompiles automatically without a restart.

### HTML templates

Accepts only `object`. Variables are available via EJS syntax (the default `html-webpack-plugin` engine):

```js
module.exports = defineConfig({
  templates: {
    type: 'html',
    entry: 'src/views/pages',
    data: {
      siteName: 'My App',
      version: process.env.npm_package_version,
    }
  }
});
```

Usage in HTML template:

```html
<title><%= siteName %></title>
<meta name="version" content="<%= version %>">
```

> Internally, data is injected via `templateParameters` as a function — not a plain object — to safely preserve the
> default `htmlWebpackPlugin` parameters alongside your custom variables.

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

For advanced use cases or framework integrations, use the internal plugin system:

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

During production builds, the plugin automatically detects your deployment environment and emits the necessary routing
configuration.

| Platform                           | Action                                                                       |
|:-----------------------------------|:-----------------------------------------------------------------------------|
| **Netlify / Cloudflare**           | Emits `_redirects` into `dist/` for SPA rewrites or MPA 404 fallback.        |
| **Vercel**                         | Logs a reminder to ensure `vercel.json` is present in your **project root**. |
| **Static / GitHub Pages / Others** | Emits `404.html` (copy of `index.html`) for SPA deep-link fallback.          |

> **Vercel note**: `vercel.json` must live in the repository root — not in `dist/`. Vercel reads it before the build
> starts. The plugin will log a reminder with a link to the Vercel docs if it detects a Vercel environment.

---

## 🏗 Architecture Principles

- **Template-First**: While Webpack handles assets, templates (Pug/HTML) drive the entry points.
- **Stability-First**: Aggressive optimizations (like `splitChunks`) are carefully tuned or disabled by default to
  ensure reliable asset resolution within templates.
- **Lazy Dependencies**: Peer dependencies (`pug-plugin`, `html-webpack-plugin`) are resolved at runtime only when
  needed — switching template engines never causes install-time errors.
- **Type Safety**: Built with TypeScript for excellent IDE support and internal build reliability.

---

## ⚠️ Requirements

- **Node.js**: `>=20.0.0` (Recommended: latest LTS)
- **Webpack**: `^5.0.0`

---

## 📄 License

This project is licensed under the ISC License.
