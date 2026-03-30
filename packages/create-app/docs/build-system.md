# Build System

`@razerspihne/build` is the **core build engine** used by all templates generated via `@razerspine/create-app`.

It provides a **modern**, **modular**, and **production-ready** **Webpack configuration**
with a focus on **stability**, **flexibility**, and **template-driven architecture**.

---

## Philosophy

The build system is designed around a few ключових принципів:

- **Explicit over implicit**
- **Template-driven architecture**
- **No framework lock-in**
- **Production stability first**
- **Extensible configuration**

---

## What It Handles

`@razerspine/build` is responsible for:

- Webpack configuration generation
- Script processing (JS / TS)
- Style processing (SCSS / Less)
- Pug template compilation
- Asset handling (images, fonts, etc.)
- Dev server setup
- Production optimizations
- Environment-based behavior

---

## Architecture Modes

### MPA (Multi Page Application)

```ts
appType: 'mpa'
```

- Multiple HTML outputs
- Directory-based template entry
- Each page is independent
- Ideal for:
  - marketing websites
  - SEO-heavy projects
  - static content

### SPA (Single Page Application)

```ts
appType: 'spa'
```

- Single HTML entry
- Client-side routing support
- Designed for runtime-driven apps
- Ideal for:
  - dashboards
  - admin panels
  - applications

---

## Pug Processing (Dual Mode)

The build system supports **two Pug compilation modes**:

### 1. Render Mode (MPA / Entries)

- Used for page templates
- Produces final HTML output
- Standard static rendering

### 2. Compile Mode (SPA / Components)

- Used when importing Pug inside JS/TS
- Compiles templates into functions
- Enables component-style architecture

### Why It Matters

This dual-mode approach allows:

- SPA components to coexist with static builds
- Clean separation between entry templates and UI fragments
- Flexible architecture without breaking builds

---

## Configuration API

The main entry is:

```ts
import {defineConfig} from '@razerspine/build';

export default defineConfig({
  appType: 'spa',
  script: 'ts',
  style: 'scss',
  templates: {
    entry: 'src/app/app.pug'
  }
});
```

---

## Key Options

| Option      | Description                  |
|-------------|------------------------------|
| `appType`   | `mpa` or `spa`               |
| `script`	   | `js` or `ts`                 |
| `style`     | `scss` or `less`             |
| `templates` | Template entry configuration |
| `resolve`   | Webpack aliases              |
| `mode`	     | development or production    |

---

## Template Entry Rules

### MPA

```ts
templates: {
  entry: 'src/views/pages'
}
```

- Must be a directory
- Each file becomes a page

### SPA

```ts
templates: {
  entry: 'src/app/app.pug'
}
```

- Must be a single file
- Always outputs `index.html`

---

## Dev & Production

### Development

- Fast rebuilds
- Source maps
- Webpack Dev Server
- HMR support

### Production

- Optimized bundles
- Minified assets
- Stable output
- Hosting-ready structure

---

## Hosting Support

Production builds automatically adapt for common platforms:

- Netlify
- Vercel
- Cloudflare Pages
- GitHub Pages

### Generated Files

| Platform             | Output              |
|----------------------|---------------------|
| Netlify / Cloudflare | `_redirects`        |
| Vercel               | `vercel.json`       |
| GitHub Pages         | `404.html` fallback |

No manual configuration required.

---

## Responsibilities Split

`@razerspine/build`

- Webpack config
- Loaders & plugins
- Environment handling
- Build lifecycle

---

## Templates

- Project structure
- Entry points
- Runtime integration
- UI composition

---

## Aliases

Templates come with preconfigured aliases:

```text
@views
@styles
@scripts
@images
@fonts
@icons
```

These work across:

- Pug
- TypeScript / JavaScript
- SCSS / Less

---

## Extending Configuration

You can extend the config if needed:

```ts
export default defineConfig({
  // base config
}).extend((config) => {
  config.resolve.alias['@custom'] = '/custom/path';
});
```

---

## Stability First

Unlike many setups:

- No aggressive defaults like `splitChunks`
- No hidden magic
- No fragile optimizations

This ensures:

- predictable builds
- consistent output
- fewer edge-case bugs

---

## Summary

`@razerspine/build` is:

- a **controlled Webpack abstraction**
- designed for **real-world projects**
- optimized for **Pug-based architectures**
- compatible with both **SPA and MPA**

It provides a **solid foundation** without limiting flexibility.
