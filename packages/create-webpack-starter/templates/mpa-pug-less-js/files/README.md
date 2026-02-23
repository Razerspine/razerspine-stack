# MPA: Pug + Less + JavaScript

![Webpack](https://img.shields.io/badge/Webpack-5-blue?logo=webpack)
![JavaScript](https://img.shields.io/badge/JavaScript-ES_Modules-F7DF1E?logo=javascript)
![Less](https://img.shields.io/badge/Less-Styling-1D365D?logo=less)
![Pug](https://img.shields.io/badge/Pug-Template-A86454?logo=pug)
![Architecture](https://img.shields.io/badge/Architecture-MPA-111827)
![License](https://img.shields.io/badge/license-ISC-green)

Production-ready webpack starter template using:

- Pug
- Less
- Modern JavaScript
- Webpack 5
- @razerspine/pug-ui-kit

---

## Dependency Alignment Notice

This template includes a temporary dependency override for `glob` and `minimatch`.

The override aligns `js-beautify` with the modern `glob@13` stack in order to avoid
a known `minimatch` ReDoS advisory affecting older transitive versions.

This change does **not** affect runtime behavior and only applies to build-time tooling.

The override will be removed once upstream packages update their dependency ranges.

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
