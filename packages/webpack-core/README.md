# @razerspine/webpack-core

[![npm version](https://img.shields.io/npm/v/@razerspine/webpack-core.svg)](https://www.npmjs.com/package/@razerspine/webpack-core)
[![changelog](https://img.shields.io/badge/docs-changelog-blue.svg)](./CHANGELOG.md)
[![license](https://img.shields.io/npm/l/@razerspine/webpack-core.svg)](./LICENSE)

Core webpack configuration and loaders for **Pug-based** projects.

This package provides a stable, production-safe webpack foundation for template-driven builds using `pug-plugin`, now
with **Smart Auto-Hosting** support.

---

## 🚀 Key Features

- **Pug template-driven builds**: Webpack JS entry is intentionally disabled.
- **Hybrid Modes**: Full support for Multi-page (MPA) and Single-page (SPA) architectures.
- **Smart Auto-Hosting (v1.9.0)**: Automatically detects **Vercel, Netlify, Cloudflare**, and **GitHub Pages** to
  generate required routing configs.
- **Zero-Config SPA Fallback**: Automatic `404.html` generation for GitHub Pages to fix client-side routing.
- **Full Tech Stack**: Native support for TypeScript/JavaScript and SCSS/Less.
- **Developer Experience**: Recursive file watching (`src/**/*`), auto-browser open, and infrastructure logging.
- **Validation Layer**: Core options are validated and normalized before Webpack initialization.

---

## 🛠 Application Modes

### MPA (Default)

`appType: 'mpa'`

- `templates.entry` must be a **directory** (e.g., `src/views/pages`).
- Each Pug file in the directory generates its own HTML file.

### SPA

`appType: 'spa'`

- `templates.entry` must be a **single Pug file** (e.g., `src/app/app.pug`).
- Always outputs `index.html`.
- Enables automatic routing configuration for production hosting.

---

## 🌍 Smart Hosting Adapter (New v1.9.0)

The core now detects the environment during the production build and emits the necessary configuration files:

| Platform                 | Generated File | Purpose                                                      |
|:-------------------------|:---------------|:-------------------------------------------------------------|
| **Netlify / Cloudflare** | `_redirects`   | Handles SPA rewrites and MPA fallbacks.                      |
| **Vercel**               | `vercel.json`  | Configures Vercel Edge Network routing.                      |
| **GitHub Pages**         | `404.html`     | Duplicates `index.html` to prevent 404 errors on deep links. |
| **Static / Others**      | `404.html`     | Generic fallback for SPA mode.                               |

---

## 📦 Installation

```bash
npm install @razerspine/webpack-core
```

---

## 📖 Usage

### Basic Setup

```js
const path = require('path');
const {
  createBaseConfig,
  createDevConfig,
  createProdConfig,
} = require('@razerspine/webpack-core');

module.exports = (env = {}, argv = {}) => {
  const mode = argv.mode || process.env.NODE_ENV || 'development';

  const baseConfig = createBaseConfig({
    mode,
    appType: 'spa', // 'spa' or 'mpa'
    scripts: 'ts',  // 'js' or 'ts'
    styles: 'scss', // 'scss' or 'less'
    templates: {
      entry: 'src/app/app.pug',
    },
    resolve: {
      alias: {
        '@app': path.resolve(process.cwd(), 'src/app'),
        '@styles': path.resolve(process.cwd(), 'src/styles'),
      },
    },
  });

  if (mode === 'development') {
    return createDevConfig(baseConfig);
  }

  return createProdConfig(baseConfig);
};
```

### Customizing Configuration

You can override any default setting by passing an object as the second argument:

```js
// Customizing the Dev Server
if (mode === 'development') {
  return createDevConfig(baseConfig, {
    port: 3000,
    open: true,
  });
}

// Customizing Production optimizations
if (mode === 'production') {
  return createProdConfig(baseConfig, {
    performance: {
      hints: 'warning',
    }
  });
}
```

---

## 🏗 Architecture Principles

- **Template-First**: Webpack handles assets, but Pug templates drive the entry points.
- **Stability-First**: Aggressive optimizations (like `splitChunks`) are disabled by default to ensure reliable asset
  resolution in templates.
- **Environment Aware**: The build process is aware of CI/CD environments and adapts output artifacts accordingly.
- **Type Safe**: Improved internal typing for Webpack 5 asset emission.

---

## 📄 License

This project is licensed under the ISC License.
