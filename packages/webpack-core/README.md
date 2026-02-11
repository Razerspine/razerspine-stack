# @razerspine/webpack-core

Core webpack configuration and loaders for **Pug-based** projects.

This package provides a stable, production-safe webpack foundation for
template-driven builds using `pug-plugin`.

---

## ⚠️ Important

Versions prior to 1.1.6 were part of a stabilization phase and are not recommended for production use.

Please use:
```bash
npm install @razerspine/webpack-core@^1.1.6
```

## Designed for

This package is developed as part of the  
[Webpack Starter Monorepo](https://github.com/Razerspine/webpack-starter-monorepo).

It contains shared webpack configuration and loaders used by the starter
templates, but can also be used independently.

---

## Design principles

- Webpack is responsible for:
  - module resolution
  - aliases (`resolve.alias`)
  - asset handling

- Loaders and plugins:
  - do not define aliases
  - do not depend on UI kits
  - do not assume project structure

- `pug-plugin` is used only to compile templates  
  Asset paths are resolved by webpack.

- Webpack JS entry is intentionally disabled  
  Builds are driven by template entries.

- No aggressive production optimizations by default  
  (e.g. no `splitChunks`)

---

## Features

- Pug templates support
- JavaScript / TypeScript
- SCSS / Less
- Environment-aware configuration
- No hardcoded aliases
- Production-safe defaults

---

## Installation

```bash
npm install @razerspine/webpack-core
```

---

## Usage

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
    scripts: 'js',
    styles: 'less',
    templates: {
      entry: 'src/views/pages',
    },
    resolve: {
      alias: {
        '@views': path.resolve(process.cwd(), 'src/views'),
        '@styles': path.resolve(process.cwd(), 'src/assets/styles'),
        '@scripts': path.resolve(process.cwd(), 'src/assets/scripts'),
        '@images': path.resolve(process.cwd(), 'src/assets/images'),
      },
    },
  });

  return mode === 'development'
    ? createDevConfig(baseConfig)
    : createProdConfig(baseConfig);
};
```

---

## 📄 License
This project is licensed under the ISC License.
