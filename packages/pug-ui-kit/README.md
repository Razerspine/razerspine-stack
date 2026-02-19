# @razerspine/pug-ui-kit

[![npm version](https://img.shields.io/npm/v/@razerspine/pug-ui-kit.svg)](https://www.npmjs.com/package/@razerspine/pug-ui-kit)
[![changelog](https://img.shields.io/badge/docs-changelog-blue.svg)](./CHANGELOG.md)
[![license](https://img.shields.io/npm/l/@razerspine/pug-ui-kit.svg)](./LICENSE)

Professional, modular UI Kit for **Pug (Jade)** templates.  
Includes reusable mixins and a complete styling system (SCSS / LESS / compiled CSS).

Designed to work seamlessly with  
👉 https://github.com/Razerspine/webpack-starter-monorepo

---

## 📦 Installation

This package is automatically included in templates generated via the CLI.

To install manually:

```bash
npm install @razerspine/pug-ui-kit
```

---

# ⚡ Quick Start

Choose the setup that fits your workflow.

---

## 1️⃣ Use Compiled CSS (Simplest)

Recommended for simple setups without Sass/Less processing.

Minified (production):

```scss
@import "@razerspine/pug-ui-kit/style/style.min.css";
```

Non-minified:

```scss
@import "@razerspine/pug-ui-kit/style/style.css";
```

✔ Includes vendor prefixes  
✔ Cross-browser ready  
✔ Dark mode support via `html[data-theme="dark"]`

---

## 2️⃣ Use SCSS (Customizable)

The UI Kit uses `!default` flags, allowing you to override any part of the theme.
```scss
@use "@razerspine/pug-ui-kit/scss/ui-kit" as *;
```

Override variables:

```scss
@use "@razerspine/pug-ui-kit/scss/settings" with (
  $font-path: "/my-custom-path/fonts"
);

@use "@razerspine/pug-ui-kit/scss/ui-kit" as *;
```

---

## 3️⃣ Use LESS

```less
@import "@razerspine/pug-ui-kit/less/ui-kit";
```

Override variables:

```less
@font-path: "/my-custom-path/fonts";
@import "@razerspine/pug-ui-kit/less/ui-kit";
```

---

# 🎨 Styling System

##### The UI Kit is a full style system including:

- **Design Tokens**: Comprehensive palette (50-900) for Brand and Neutral colors.
- **Themes**: Built-in Light and Dark modes using CSS Variables.
- **Base reset**: Modern CSS reset.
- **Layout & Components**: Grid system and reusable UI elements.

#### The main entry file:

SCSS:
```scss
@use "@razerspine/pug-ui-kit/scss/ui-kit" as *;
```

LESS:
```less
@import "@razerspine/pug-ui-kit/less/ui-kit";
```

#### Theme Variables (CSS)

The system maps SCSS/LESS tokens to native CSS variables (example):

| CSS Variable      | Default (Light)     | Default (Dark)       |
|-------------------|---------------------|----------------------|
| `--brand-500`     | `#6366f1` (Indigo)  | Inherited            |
| `--bg-color`      | `#fafafa` (Zinc 50) | `#09090b` (Zinc 950) |
| `--text-primary`  | `#18181b`           | `#f4f4f5`            |
| `--border-subtle` | `#e4e4e7`           | `#27272a`            |

---

# 🧩 Modular Imports (Advanced Usage)

The UI Kit is fully modular.

Each directory contains its own `_index` file, allowing granular imports.

## SCSS structure

```
scss/
├── ui-kit.scss
├── fonts.scss
├── base/
├── settings/
├── themes/
├── layout/
├── components/
└── utils/
```

Example: import only components + tokens

```scss
@use "@razerspine/pug-ui-kit/scss/settings/index" as *;
@use "@razerspine/pug-ui-kit/scss/components/index" as *;
```

Import single component:

```scss
@use "@razerspine/pug-ui-kit/scss/settings/index" as *;
@use "@razerspine/pug-ui-kit/scss/components/buttons";
```

⚠ When using partial imports, you must import required dependencies manually (e.g., settings before components).

---

# 🔎 Font Architecture (Since v1.4.0)

`@font-face` declarations are no longer injected automatically.

This improves:

- flexibility
- performance control
- enterprise compatibility
- design system neutrality

## Use bundled Roboto

SCSS:

```scss
@use "@razerspine/pug-ui-kit/scss/fonts";
@use "@razerspine/pug-ui-kit/scss/ui-kit" as *;
```

LESS:

```less
@import "@razerspine/pug-ui-kit/less/fonts";
@import "@razerspine/pug-ui-kit/less/ui-kit";
```

## Use your own font

SCSS:

```scss
@use "@razerspine/pug-ui-kit/scss/ui-kit" with (
  $font-family: "Inter", system-ui, sans-serif
);
```

LESS:

```less
@font-family: "Inter", system-ui, sans-serif;
@import "@razerspine/pug-ui-kit/less/ui-kit";
```

The UI Kit controls typography styling — not font delivery.

---

# 🔄 Migration Guide (v1.4.0)

## What changed?

`@font-face` is no longer auto-included in `ui-kit`.

Compiled CSS users are NOT affected.

---

### Before (≤1.3.x)

SCSS:

```scss
@use "@razerspine/pug-ui-kit/scss/ui-kit" as *;
```

LESS:

```less
@import "@razerspine/pug-ui-kit/less/ui-kit";
```

---

### After (≥1.4.0)

SCSS:

```scss
@use "@razerspine/pug-ui-kit/scss/fonts";
@use "@razerspine/pug-ui-kit/scss/ui-kit" as *;
```

LESS:

```less
@import "@razerspine/pug-ui-kit/less/fonts";
@import "@razerspine/pug-ui-kit/less/ui-kit";
```

---

# 🧱 Pug Components

Reusable mixins located in `mixins/`.

To avoid complex relative paths, configure Webpack alias:

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

Then import in Pug:

```pug
include ~pug-ui-kit/btn.pug
```

---

## 🔘 Button

```pug
include ~pug-ui-kit/btn.pug

+btn('Save', 'primary', 'small', { type: 'submit' })
```

#### Parameters:

| Param    | Type   | Default              | Description      |
|----------|--------|----------------------|------------------|
| text     | String | null                 | Button text      |
| variant  | String | 'primary'            | Style modifier   |
| size     | String | 'medium'             | Size modifier    |
| attrs    | Object | `{ type: 'button' }` | Extra attributes |
| iconName | String | null                 | SVG sprite icon  |

---

## 📊 Data Table

```pug
include ~pug-ui-kit/data-table.pug

- const data = [{id:1, name:'Alice'}, {id:2, name:'Bob'}]

+dataTable(data, ['id','name'], {
  showIndex: true,
  labels: { name: 'Full Name' }
})
```

Features:

- Auto column detection
- Custom formatters
- Optional actions column
- Empty state support

---

## 📝 Form Input

```pug
include ~pug-ui-kit/form-input.pug

+formInput('text', 'username', 'Name', 'Enter your name', 'username')
```

---

## 📄 Textarea

```pug
include ~pug-ui-kit/form-textarea.pug

+formTextarea('message', 'Message', 'Type your message...', 'message')
```

---

## ☑ Checkbox

```pug
include ~pug-ui-kit/input-checkbox.pug

+inputCheckbox('agree', 'I agree to all terms')
```

---

## 🔘 Radio

```pug
include ~pug-ui-kit/input-radio.pug

+inputRadio('contact-email', 'Email', 'contact', 'email')
```

---

## 🔽 Single Select

```pug
include ~pug-ui-kit/single-select.pug

+singleSelect('topic', 'Topic', [
  {value:'support', text:'Support'},
  {value:'feedback', text:'Feedback'}
])
```

---

# 📂 Package Structure

```
mixins/   → Pug components
scss/     → Complete SCSS system (with !default variables)
less/     → Complete LESS system
style/    → Compiled CSS output
index.js  → Path resolution helper
```

---

# ⚙ Build (For Contributors)

```bash
npm run build
```

This will:

- Compile SCSS
- Run PostCSS + Autoprefixer
- Generate minified CSS

---

# 📄 License

ISC License
