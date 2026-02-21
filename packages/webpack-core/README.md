# @razerspine/webpack-core
[![npm version](https://img.shields.io/npm/v/@razerspine/webpack-core.svg)](https://www.npmjs.com/package/@razerspine/webpack-core)
[![changelog](https://img.shields.io/badge/docs-changelog-blue.svg)](./CHANGELOG.md)
[![license](https://img.shields.io/npm/l/@razerspine/webpack-core.svg)](./LICENSE)


Core webpack configuration and loaders for **Pug-based** projects.

This package provides a stable, production-safe webpack foundation for
template-driven builds using `pug-plugin`.

---

## Designed for

Part of the
[Webpack Starter Monorepo](https://github.com/Razerspine/webpack-starter-monorepo).

Can be used independently in any Pug-based project.

---

## Key Features

- Pug template-driven builds (no implicit JS entry)
- Multi-page (MPA) and Single-page (SPA) modes
- JavaScript or TypeScript support
- SCSS or Less support
- Recursive file watching (`src/**/*`)
- SPA-friendly dev server
- Config validation layer
- Centralized options normalization (v1.7.0+)
- Fully customizable dev & prod configs

---

## Application Modes (v1.7.0+)

### MPA (Default)

```js
appType: 'mpa'
```

- `templates.entry` must be a directory
- Example: `src/views/pages`
- Each page generates its own HTML file

### SPA

```js
appType: 'spa'
```

- `templates.entry` must be a single Pug file
- Example: `src/views/app.pug`
- Always outputs: `index.html`

---

## Design Principles

- **Webpack is responsible for**: module resolution, aliases (`resolve.alias`), and asset handling.
- **Template-driven architecture**: Webpack JS entry is intentionally disabled. Builds are driven by Pug template entries.
- **MPA by default**: Directory-based page generation remains the primary mode.
- **Optional SPA support (v1.7.0+)**: Single-entry template mode is supported without breaking MPA workflow.
- **Stability-first production defaults**: No aggressive optimizations (e.g. `splitChunks`) are enabled by default to prevent template asset resolution issues.
- **Validated configuration layer**: Core options are validated before Webpack initialization.
- **Centralized option normalization (v1.7.0+)**: Default resolution is handled internally through a normalization layer to avoid configuration drift.
- **Flexible overrides**: Dev and Prod configs can be extended safely via optional parameters.

---

## Features

- **Pug templates support** with auto-discovery.
- **JavaScript / TypeScript** integration.
- **SCSS / Less** styling support.
- **Recursive File Watching**: Dev server watches all changes in `src/**/*`.
- **SPA-friendly Dev Server**: Integrated historyApiFallback (redirects to 404.html).
- **Customizable**: Easily override devServer or optimization settings.
- **Configuration validation layer**
- **Automatic browser open in development (v1.2.2+)**

---

## Installation

```bash
npm install @razerspine/webpack-core
```

---

## Usage

### Basic Setup

```js
const path = require('path');
const {
  createBaseConfig,
  createDevConfig,
  createProdConfig,
} = require('@razerspine/webpack-core');

module.exports = (env = {}, argv = {}) => {
  const mode = argv.mode || 'development';

  const baseConfig = createBaseConfig({
    mode,
    appType: 'mpa', // or 'spa'
    scripts: 'js', // or 'ts'
    styles: 'scss', // or 'less'
    templates: {
      entry: 'src/views/pages',
    },
    resolve: {
      alias: {
        '@views': path.resolve(process.cwd(), 'src/views'),
        '@styles': path.resolve(process.cwd(), 'src/assets/styles'),
      },
    },
  });

  if (mode === 'development') {
    return createDevConfig(baseConfig);
  }

  return createProdConfig(baseConfig);
};
```

### Customizing Configuration (v1.2.1+)

You can now pass an optional second argument to `createDevConfig` and `createProdConfig` to override defaults:

```js
// Customizing the Dev Server (port, open browser, etc.)
if (mode === 'development') {
  return createDevConfig(baseConfig, {
    port: 3000,
    open: true,
    // extra devServer options...
  });
}

// Customizing Production (minification, performance hints, etc.)
if (mode === 'production') {
  return createProdConfig(baseConfig, {
    performance: {
      hints: 'warning',
    }
  });
}
```

---

## Architecture Principles
- Webpack handles module resolution and asset processing
- PugPlugin handles template compilation
- No implicit webpack JS entry
- No aggressive production optimizations by default
- Options validated before build initialization
- Defaults resolved through a normalization layer (v1.7.0+)

---

## Stability

Versions prior to 1.1.6 were part of a stabilization phase and are not recommended for production use.

---

## API Reference

`createBaseConfig(options)`

Core configuration factory.

**Options include**:

- `mode` — `'development' | 'production'`
- `scripts` — `'js' | 'ts'`
- `styles` — `'scss' | 'less'`
- `templates.entry` — Path to template pages directory
- `resolve.alias` — Webpack aliases

All options are validated before initialization.

---

`createDevConfig(baseConfig, options?)`

- `baseConfig`: The configuration returned by createBaseConfig.
- `options`: (Optional) webpack-dev-server configuration object.
- **Default behavior**: Watches `src/**/*`, uses port `8080`, and rewrites 404s to `/404.html`.

---

`createProdConfig(baseConfig, options?)`

- `baseConfig`: The configuration returned by createBaseConfig.
- `options`: (Optional) Webpack configuration object for production overrides.
- **Default behavior**: Enables source maps, minification, and disables `splitChunks` for template compatibility.

---

## 📄 License

This project is licensed under the ISC License.
