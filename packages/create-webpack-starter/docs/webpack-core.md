# webpack-core

`@razerspine/webpack-core` is the foundation used by all starter templates.

It provides a **stable, minimal, and production-safe webpack configuration**
focused on template-driven builds with optional SPA support.

---

## Core Philosophy

- Webpack handles module resolution and assets
- `pug-plugin` handles template compilation
- No implicit JS entry (`./src`)
- No aggressive optimizations by default
- Aliases are resolved by webpack, not by plugins
- Architecture mode (`mpa` / `spa`) is explicit

---

## Application Modes (v1.7.1+)

### MPA (Default)

```js
appType: 'mpa'
```

- `templates.entry` must be a directory
- Example: `src/views/pages`
- Each page generates its own HTML file
- Layout-driven, static page architecture

### SPA 

```js
appType: 'spa'
```

- `templates.entry` must be a single Pug file
- Example: `src/views/app.pug`
- Always outputs index.html
- Enables client-side routing
- Designed for application-style projects

---

## Universal Pug Loading Strategy (v1.7.2+)

`webpack-core` introduces a **dual-mode** Pug compilation system.

### Static Entry Templates

**Used as HTML output**: `method: 'render'`

- Used for page entries
- Generates final HTML files
- Standard MPA behavior

---

### Component Pug Imports (SPA Support)

**Used inside JS/TS**: `method: 'compile'`

- Pug files imported into scripts are compiled into functions
- Enables component-like architecture
- Allows SPA-style template composition
- Compatible with router-driven rendering

---

### Why This Matters

Without dual-mode compilation:

- SPA components would break static builds
- Static entries would break dynamic imports

The new `pugRule()` with `oneOf` logic ensures both modes coexist safely.

---

## Automated Hosting Support (v1.10.0+)

Production builds automatically generate routing configuration files
for common static hosting environments.

Supported platforms:

- Netlify
- Cloudflare Pages
- Vercel
- GitHub Pages

Generated files:

| Platform             | File                |
|----------------------|---------------------|
| Netlify / Cloudflare | `_redirects`        |
| Vercel               | `vercel.json`       |
| GitHub Pages         | `404.html` fallback |

Hosting is detected automatically using environment variables provided by
the hosting platform.

This allows **zero-config deployment for SPA routing**.

---

## Responsibilities

### webpack-core

- loaders (scripts, styles, assets)
- `pugRule()` dual-mode handling
- resolve.alias
- environment handling
- dev / prod separation
- options normalization
- validation layer

### Templates

- project structure
- concrete entry paths
- alias definitions
- router logic (SPA)
- UI kit integration

---

## Options Normalization (v1.7.1+)

All options pass through an internal normalization layer:

- `mode`
- `appType`
- `templates.entry`
- `resolve.alias`

This prevents configuration drift and ensures stable defaults.

---

## Validation Layer

Configuration is validated before Webpack initialization:

- `appType` must be `'mpa' | 'spa'`
- templates.entry must match architecture mode
- Script and style types must be valid

Invalid configuration fails early.

---

## Why no splitChunks by default?

During real-world testing, aggressive chunk splitting caused:

- broken Pug asset resolution
- unexpected entry lookups
- unstable production builds

Stability is prioritized over aggressive optimization.
You may enable it manually if required.

---

## Usage Example

```js
const path = require('path');
const { createBaseConfig } = require('@razerspine/webpack-core');

createBaseConfig({
  mode: 'development',
  appType: 'spa', // or 'mpa'
  scripts: 'ts', // or 'js'
  styles: 'scss', // or 'less'
  templates: {
    entry: 'src/views/app.pug'
  },
  resolve: {
    alias: {
      '@images': path.resolve('src/assets/images')
    }
  }
});
```

---

## Architecture Summary

- Template-driven builds remain the core
- MPA is default and fully stable
- SPA mode is officially supported (v1.7.1+)
- Dual-mode Pug compilation enables component-style usage
- Production stability remains the top priority
