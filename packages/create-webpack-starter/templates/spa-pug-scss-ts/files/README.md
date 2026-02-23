# SPA: Pug + SCSS + TypeScript

![Webpack](https://img.shields.io/badge/Webpack-5-blue?logo=webpack)
![TypeScript](https://img.shields.io/badge/TypeScript-Enabled-3178C6?logo=typescript)
![SCSS](https://img.shields.io/badge/SCSS-Sass-CC6699?logo=sass)
![Pug](https://img.shields.io/badge/Pug-Template-A86454?logo=pug)
![Architecture](https://img.shields.io/badge/Architecture-SPA-111827)
![License](https://img.shields.io/badge/license-ISC-green)

A production-ready Webpack starter template for building scalable Single Page Applications using:

- **Pug** - HTML templating
- **SCSS (Sass)** - modular styling
- **TypeScript** - type-safe application logic
- **Webpack 5** - optimized build system
- **@razerspine/pug-ui-kit** - modular UI system

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

Generated with `create-webpack-starter`.
