# @razerspine/webpack-core
[![npm version](https://img.shields.io/npm/v/@razerspine/webpack-core.svg)](https://www.npmjs.com/package/@razerspine/webpack-core)
[![changelog](https://img.shields.io/badge/docs-changelog-blue.svg)](./CHANGELOG.md)
[![license](https://img.shields.io/npm/l/@razerspine/webpack-core.svg)](./LICENSE)


Core webpack configuration and loaders for **Pug-based** projects.

This package provides a stable, production-safe webpack foundation for
template-driven builds using `pug-plugin`.

---

## ⚠️ Important

Versions prior to 1.1.6 were part of a stabilization phase and are not recommended for production use.

Please use:

```bash
npm install @razerspine/webpack-core@^1.2.1
```

## Designed for

This package is developed as part of the  
[Webpack Starter Monorepo](https://github.com/Razerspine/webpack-starter-monorepo).

It contains shared webpack configuration and loaders used by the starter
templates, but can also be used independently.

---

## Design principles

- **Webpack is responsible for**: module resolution, aliases (`resolve.alias`), and asset handling.
- **Flexibility:** Since v1.2.1, you can override any part of the dev or prod configuration using an optional `options`
  argument.
- **Stability:** `pug-plugin` is used to compile templates, and asset paths are resolved by webpack.
- **Template-driven**: Webpack JS entry is intentionally disabled. Builds are driven by template entries in
  `src/views/pages`.
- **Sensible Defaults**: No aggressive production optimizations (like `splitChunks`) are enabled by default to prevent
  asset resolution issues in templates.
- **Validated configuration layer (v1.2.2+)**: Core options are validated before build initialization to prevent silent
  runtime failures.

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

## What’s New in v1.2.2

- Added `validateCoreOptions()` inside `createBaseConfig`
  - Validates `mode`, `scripts`, and `styles`
  - Ensures templates entry directory exists before Webpack starts
- Dev server now opens the browser automatically (`open: true` by default)

> No breaking changes were introduced.

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

## 📄 License

This project is licensed under the ISC License.
