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
- [Static Files](#-static-files)
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
- **Static File Copying**: Drop any file into `static/` — it is automatically copied to `dist/` in every build,
  no config required.
- **Smart Auto-Hosting**: Automatically detects **Vercel, Netlify, and Cloudflare** to generate required routing
  configs.
- **Enhanced DX**: Recursive file watching (`src/**/*`), automatic browser opening, and detailed infrastructure logging.
- **Build Plugins Lifecycle**: Extend the build process safely using `setup`, `applyBase`, `applyDev`, and `applyProd`
  hooks.
- **HTML Component Architecture**: Both `pug` and `html` modes support `import template from './home.html'` in JS/TS —
  the same component pattern works regardless of template engine.
- **Lazy Peer Dependencies**: Peer dependencies are resolved at runtime only when actually used — no install errors when
  switching template engines.
- **Rock Solid**: Covered by 92+ Unit, Integration, E2E, and Snapshot tests.

---

## 📦 Installation

```bash
npm install -D @razerspine/build
```

Peer dependencies are optional and only required based on your template engine choice:

| Template engine         | Required peer dependencies                                                                       |
|:------------------------|:-------------------------------------------------------------------------------------------------|
| `type: 'pug'` (default) | `npm install -D pug-plugin`                                                                      |
| `type: 'html'`          | `npm install -D html-webpack-plugin ejs-loader html-loader mini-css-extract-plugin style-loader` |
| `type: 'none'`          | none                                                                                             |

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
- All `.html` (or `.pug`) files in the directory are scanned **recursively**, including nested subdirectories.
  Output paths mirror the source structure:
  ```
  src/views/pages/
    index.html           → dist/index.html
    about/index.html     → dist/about/index.html
    shop/product.html    → dist/shop/product.html
  ```

### SPA

`appType: 'spa'`

- `templates.entry` must be a single file (e.g., `src/app/app.pug` or `index.html`).
- Always outputs `index.html`.
- Enables automatic SPA fallback routing (`404.html`) for static hosts.

---

## 📄 Template Engines

Control template processing via `templates.type`:

- `pug` (Default) — uses `PugTemplatesPlugin`. Dual-mode: compiles Pug files imported from JS/TS as
  functions (`import template from './home.pug'`), renders entry files as static HTML.
- `html` — uses `HtmlTemplatesPlugin` + `htmlRule` + `htmlStylesRule`. Full component architecture
  support: import HTML templates from JS/TS, connect styles via `import`, standard Webpack JS/TS entry.
- `none` — disables template handling entirely (useful for React/Vue or custom setups).

### HTML mode — full setup example

**`webpack.config.js`**:

```js
const {defineConfig} = require('@razerspine/build');

module.exports = defineConfig({
  appType: 'spa',
  scripts: 'ts',
  styles: 'scss',
  templates: {
    type: 'html',
    entry: 'src/app/index.html',        // HTML template processed by html-webpack-plugin
    scriptEntry: 'src/app/main.ts',     // JS/TS entry registered as webpack entry (default: src/app/main.ts)
  },
});
```

**`src/app/index.html`** — the entry HTML template. No `<script>` or `<link>` tags needed —
`html-webpack-plugin` injects the compiled bundle and CSS automatically:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My App</title>
</head>
<body>
  <div id="app"></div>
</body>
</html>
```

**`src/app/main.ts`** — the script entry. Import global styles here:

```ts
import '../styles/main.scss';
import {bootstrapApplication} from '@razerspine/runtime';
// ...
```

**Component templates** — import `.html` files from JS/TS as callable functions:

```ts
// src/pages/home/home.page.ts
import './style.scss';
import template from './home.html';

export class HomePage extends BaseComponent<HomeState> {
  public render() {
    this.container.innerHTML = template();
  }
}
```

> **`templates.scriptEntry`** defaults to `src/app/main.ts` (when `scripts: 'ts'`) or
> `src/app/main.js` (when `scripts: 'js'`). You can override it explicitly in the config.
> If the default file does not exist, a clear error is thrown before the build starts.

> **CSS extraction**: in development, styles are injected via `<style>` tags by `style-loader`
> (HMR-friendly). In production, `MiniCssExtractPlugin` extracts them into a separate `.css` file
> which `html-webpack-plugin` injects as a `<link>` tag automatically.

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

## 📁 Static Files

Place any file inside a `static/` directory in your project root — it will be copied automatically
to `dist/` on every build (development and production), with the directory structure preserved.

No configuration is required. If `static/` does not exist, the plugin silently skips.

```
static/
  robots.txt          → dist/robots.txt
  favicon.ico         → dist/favicon.ico
  images/og-image.png → dist/images/og-image.png
```

This follows the "Convention over Configuration" principle — useful for files that must be
served as-is and should not go through Webpack's asset pipeline (e.g. `robots.txt`, `.htaccess`,
pre-built icons, manifest files).

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

Use `override` to completely replace the internal plugin list. All internal template plugins
(`PugPlugin`, `HtmlWebpackPlugin`, `MiniCssExtractPlugin`, `HostingRoutingPlugin`) are
suppressed — only the plugins you supply are used:

```js
module.exports = defineConfig({
  plugins: {
    override: [new DefinePlugin({VERSION: '"1.0.0"'})],
  }
});
// config.plugins === [DefinePlugin] — no internal plugins injected
```

> **Note on rules deduplication**: rules with the same `test` pattern but different loaders
> are treated as distinct and are never silently merged. To fully replace an internal rule,
> use `rules.override`.

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
- **Stability-First**: Optimizations are carefully scoped by default. `splitChunks` uses a `vendors` cache group
  targeting script files only (`/\.(js|ts)$/`) — styles and assets are excluded to ensure reliable asset resolution
  within templates. The `vendors` chunk is shared across all entry points, reducing bundle size on MPA builds.
- **Lazy Dependencies**: All peer dependencies are resolved at runtime only when actually used —
  switching template engines never causes install-time errors. Missing dependencies produce clear, actionable errors.
- **Uniform Plugin Factories**: All internal plugins (`PugTemplatesPlugin`, `HtmlTemplatesPlugin`,
  `HostingRoutingPlugin`) are implemented as `BuildPluginType` factory functions returning lifecycle hooks
  (`applyBase` / `applyProd`). Plugin instances are pushed into `config.plugins` declaratively, making
  them visible to `dedupePlugins` and fully replaceable via `plugins.override`.
- **Type Safety**: Built with TypeScript for excellent IDE support and internal build reliability.

---

## ⚠️ Requirements

- **Node.js**: `>=20.0.0` (Recommended: latest LTS)
- **Webpack**: `^5.0.0`

---

## 📄 License

This project is licensed under the ISC License.
