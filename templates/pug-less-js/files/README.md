# Pug + Less + JavaScript

Production-ready webpack starter template using:

- Pug
- Less
- Modern JavaScript
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

## 🎨 UI System — pug-ui-kit

Integrated modular UI system.

Main style file:

```
assets/styles/main.less
```

```less
@import "@razerspine/pug-ui-kit/less/ui-kit";
```

Supports:

- Themes
- Modular components
- Layout utilities
- Pug mixins

---

## 🔄 Runtime Services

- ThemeService
- TranslationService
- ApiService

---

Generated with `create-webpack-starter`.
