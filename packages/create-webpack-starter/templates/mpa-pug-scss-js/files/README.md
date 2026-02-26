# MPA: Pug + SCSS + JavaScript

![Webpack](https://img.shields.io/badge/Webpack-5-blue?logo=webpack)
![JavaScript](https://img.shields.io/badge/JavaScript-ES_Modules-F7DF1E?logo=javascript)
![SCSS](https://img.shields.io/badge/SCSS-Sass-CC6699?logo=sass)
![Pug](https://img.shields.io/badge/Pug-Template-A86454?logo=pug)
![Architecture](https://img.shields.io/badge/Architecture-MPA-111827)
![License](https://img.shields.io/badge/license-ISC-green)

Production-ready webpack starter template using:

- Pug
- SCSS
- Modern JavaScript (ES Modules)
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

This template includes a complete UI system powered by:

@razerspine/pug-ui-kit

Main entry:

```
assets/styles/main.scss
```

```scss
@use "@razerspine/pug-ui-kit/scss/ui-kit" as *;
```

Supports:

- Themes (light/dark)
- Modular components
- Utilities
- Design tokens
- Pug mixins

---

## 🔄 Runtime Services

- ThemeService
- TranslationService
- ApiService

---

## 🔗 Aliases

```
@styles
@scripts
@images
@icons
@views
```

---

## 🔒 Dependency Overrides

This template includes explicit `overrides` for:

- `glob`
- `minimatch`

These overrides mitigate a known transitive ReDoS advisory caused by older `minimatch` versions pulled via:

- `pug-plugin` → `js-beautify` → `glob`

The override:

- Applies to build-time tooling only
- Does not affect runtime bundles
- Is safe and tested within this toolchain
- It will be removed once upstream dependencies are updated.

---

Generated with `create-webpack-starter`.
