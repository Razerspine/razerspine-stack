# SPA: Pug + SCSS + JavaScript

![Webpack](https://img.shields.io/badge/Webpack-5-blue?logo=webpack)
![JavaScript](https://img.shields.io/badge/JavaScript-ES_Modules-F7DF1E?logo=javascript)
![SCSS](https://img.shields.io/badge/SCSS-Sass-CC6699?logo=sass)
![Pug](https://img.shields.io/badge/Pug-Template-A86454?logo=pug)
![Architecture](https://img.shields.io/badge/Architecture-SPA-111827)
![License](https://img.shields.io/badge/license-ISC-green)

A production-ready Webpack starter template for building modern Single Page Applications using:

- **Pug**
- **SCSS (Sass)**
- **Modern JavaScript (ES Modules)**
- **Webpack 5**
- **@razerspine/pug-ui-kit**

---

## 🚀 Getting Started

```bash
npm install
npm run dev
npm run build
npm run preview
```

## 📦 Project Structure

```text
src/
  assets/
    i18n/
    icons/
    images/
    scripts/
    styles/
  views/
    layout/
    mixins/
    pages/
```

---

## 🎨 UI System @razerspine/pug-ui-kit

Modular UI system for Pug-based projects.

### Main Style Entry

```text
assets/styles/main.scss
```

```scss
@use "@razerspine/pug-ui-kit/scss/ui-kit" as *;
```

### Supports:

- Themes (light / dark)
- Modular components
- Utilities
- Design tokens
- Pug mixins

---

## 🔄 Runtime Services

- `ThemeService`
- `TranslationService`
- `ApiService`

---

## 🔗 Path Aliases

```text
@styles
@scripts
@images
@icons
@views
```

---

## 🏗 Architecture Principles

- Framework-agnostic
- Fully standalone
- Modular UI system
- Production-ready structure

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
