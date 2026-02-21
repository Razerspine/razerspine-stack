# MPA: Pug + SCSS + TypeScript

Production-ready webpack starter template using:

- Pug (templating)
- SCSS (Sass)
- TypeScript
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

## 📂 Project Structure

```
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

# 🎨 UI System — pug-ui-kit

This template includes **@razerspine/pug-ui-kit**, a modular UI system designed for Pug projects.

It provides:

- Design tokens (colors, spacing, typography)
- Light / Dark theme support
- Layout system
- UI components
- Utility classes
- Pug mixins (buttons, forms, tables, etc.)

Main style entry:

```
assets/styles/main.scss
```

Import:

```scss
@use "@razerspine/pug-ui-kit/scss/ui-kit" as *;
```

If using bundled fonts (v1.4+):

```scss
@use "@razerspine/pug-ui-kit/scss/fonts";
@use "@razerspine/pug-ui-kit/scss/ui-kit" as *;
```

---

## 🧩 Using Pug Components

Configure Webpack alias:

```js
const uiKit = require('@razerspine/pug-ui-kit');

module.exports = {
  resolve: {
    alias: {
      'pug-ui-kit': uiKit.paths.mixins,
    },
  },
};
```

Then use inside Pug:

```pug
include ~pug-ui-kit/btn.pug

+btn('Save', 'primary')
```

---

## 🔄 Runtime Services

Included:

- ThemeService
- TranslationService
- ApiService

Example:

```ts
import ThemeService from '@scripts/theme-service';

const theme = new ThemeService();
theme.init();
```

---

## 🌍 Internationalization

Add translations in:

```
assets/i18n/
```

Use in markup:

```html
<h1 data-i18n="hero.title"></h1>
```

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

## 🏗 Philosophy

- No runtime dependency on CLI
- Fully standalone project
- Modular UI system
- Framework-agnostic architecture

---

Generated with `create-webpack-starter`.
