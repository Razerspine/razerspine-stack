# SPA: Pug + Less + TypeScript

![Webpack](https://img.shields.io/badge/Webpack-5-blue?logo=webpack)
![TypeScript](https://img.shields.io/badge/TypeScript-Enabled-3178C6?logo=typescript)
![Less](https://img.shields.io/badge/Less-Styling-1D365D?logo=less)
![Pug](https://img.shields.io/badge/Pug-Template-A86454?logo=pug)
![Architecture](https://img.shields.io/badge/Architecture-SPA-111827)
![License](https://img.shields.io/badge/license-ISC-green)

A production-ready Webpack starter template for building scalable SPAs using:

- **Pug**
- **Less**
- **TypeScript**
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
---

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

Integrated modular UI system.

### Main Style Entry

```text
assets/styles/main.less
```

```less
@import "@razerspine/pug-ui-kit/less/ui-kit";
```

Supports:

- Themes
- Modular components
- Utilities
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
- Standalone project
- Modular UI architecture
- Production-ready build setup

---

Generated with `create-webpack-starter`.
