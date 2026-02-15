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
