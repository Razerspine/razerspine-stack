# SPA: Pug + Less + JavaScript

A production-ready Webpack starter template for building modern SPAs using:

- **Pug**
- **Less**
- **Modern JavaScript**
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
