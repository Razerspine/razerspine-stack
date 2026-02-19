# Pug + Less + TypeScript

Production-ready webpack starter template using:

- Pug
- Less
- TypeScript
- Webpack 5
- @razerspine/pug-ui-kit

---

## 🚀 Getting Started

```bash
npm install
npm run dev
npm run build
npm run preview
```

---

## Security Notice

Dev-only audit warnings may appear due to transitive dependencies
of build tools (e.g. glob / minimatch).

These do not affect runtime or production bundles.

Production dependencies are continuously monitored and must remain vulnerability-free.

---

# 🎨 UI System — pug-ui-kit

Includes full Less-based UI system.

Main entry:

```
assets/styles/main.less
```

Import:

```less
@import "@razerspine/pug-ui-kit/less/ui-kit";
```

If using bundled fonts (v1.4+):

```less
@import "@razerspine/pug-ui-kit/less/fonts";
@import "@razerspine/pug-ui-kit/less/ui-kit";
```

Provides:

- Design tokens
- Layout system
- Components
- Utilities
- Theme support

---

## 🧩 Pug Components

```pug
include ~pug-ui-kit/btn.pug

+btn('Submit', 'primary')
```

---

## 🔄 Runtime Services

- ThemeService
- TranslationService
- ApiService

---

Generated with `create-webpack-starter`.
