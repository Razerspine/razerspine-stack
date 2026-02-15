# Pug + SCSS + JavaScript

Production-ready webpack starter template using:

- Pug
- SCSS
- Modern JavaScript (ES Modules)
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
