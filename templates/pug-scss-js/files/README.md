# Pug + SCSS + JavaScript

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

Generated with `create-webpack-starter`.
