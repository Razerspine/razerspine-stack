# @razerspine/ui

[![npm version](https://img.shields.io/npm/v/@razerspine/ui.svg)](https://www.npmjs.com/package/@razerspine/ui)
[![Vitest](https://img.shields.io/badge/Vitest-89_passed-success?logo=vitest)]()
[![changelog](https://img.shields.io/badge/docs-changelog-blue.svg)](./CHANGELOG.md)
[![license](https://img.shields.io/npm/l/@razerspine/ui.svg)](./LICENSE)

A modern, modular **UI layer for Pug-based applications**.
Provides a complete styling system (SCSS / LESS / CSS) and reusable Pug components.

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#-quick-start)
  - [Use Compiled CSS](#use-compiled-css)
  - [Use SCSS](#use-scss)
  - [Use LESS](#use-less)
- [Styling System](#styling-system)
- [Fonts](fonts)
- [Modular Imports](#modular-imports-advanced)
- [Pug Components](#pug-components)
- [Documentation](#documentation)
- [Package Structure](#package-structure)
- [Build (Contributors)](#build-for-contributors)
- [License](#license)

---

# Installation

```bash
npm install @razerspine/ui
```

---

## ⚡ Quick Start

### Use Compiled CSS

Best for simple setups without preprocessors.

```scss
@import "@razerspine/ui/css/ui.min.css";
```

✔ Autoprefixed
✔ Minified
✔ Ready for production

---

### Use SCSS

```scss
@use "@razerspine/ui/scss" as *;
```

Override variables:

```scss
@use "@razerspine/ui/scss/settings" with (
  $font-path: "/my-fonts"
);

@use "@razerspine/ui/scss" as *;
```

---

### Use LESS

```less
@import "@razerspine/ui/less";
```

Override variables:

```less
@font-path: "/my-fonts";
@import "@razerspine/ui/less";
```

---

## Styling System

The UI layer includes:

- Design tokens (color system, spacing, typography)
- Light / Dark themes (via CSS variables)
- Base reset
- Layout system (grid)
- UI components

### Entry points

SCSS:

```scss
@use "@razerspine/ui/scss" as *;
```

LESS:

```less
@import "@razerspine/ui/less";
```

---

## Fonts

Fonts are **optional and not auto-included**.

### Use bundled Roboto

SCSS:

```scss
@use "@razerspine/ui/scss/fonts";
@use "@razerspine/ui/scss" as *;
```

LESS:

```less
@import "@razerspine/ui/less/fonts";
@import "@razerspine/ui/less";
```

### Use custom font

SCSS:

```scss
@use "@razerspine/ui/scss" with (
  $font-family: "Inter", system-ui, sans-serif
);
```

LESS:

```less
@font-family: "Inter", system-ui, sans-serif;
@import "@razerspine/ui/less";
```

---

## Modular Imports (Advanced)

Each layer is split into modules:

```text
scss/
  base/
  settings/
  themes/
  layout/
  components/
  utils/
```

Example:

```scss
@use "@razerspine/ui/scss/settings" as *;
@use "@razerspine/ui/scss/components";
```

> ⚠ When using partial imports, you must include dependencies manually.

---

## Pug Components

Reusable mixins are available via:

```text
dist/pug/mixins/*
```

### Webpack alias example

```js
const ui = require('@razerspine/ui');

module.exports = {
  resolve: {
    alias: {
      'ui-mixins': ui.paths.mixins,
    },
  },
};
```

Usage:

```pug
include ~ui-mixins/btn.pug
```

---

## Documentation

Full documentation for all mixins is available in:

```text
docs/
```

- [Button](https://github.com/Razerspine/webpack-starter-monorepo/blob/main/packages/ui/docs/btn.md)
- [Data Table](https://github.com/Razerspine/webpack-starter-monorepo/blob/main/packages/ui/docs/data-table.md)
- [Form Input](https://github.com/Razerspine/webpack-starter-monorepo/blob/main/packages/ui/docs/form-input.md)
- [Textarea](https://github.com/Razerspine/webpack-starter-monorepo/blob/main/packages/ui/docs/form-textarea.md)
- [Checkbox](https://github.com/Razerspine/webpack-starter-monorepo/blob/main/packages/ui/docs/input-checkbox.md)
- [Radio](https://github.com/Razerspine/webpack-starter-monorepo/blob/main/packages/ui/docs/input-radio.md)
- [Single Select](https://github.com/Razerspine/webpack-starter-monorepo/blob/main/packages/ui/docs/single-select.md)

---

## Package Structure

```text
src/        → source files
scripts/    → build tools (not published)
dist/       → distributable output

dist/
  css/      → compiled CSS
  scss/     → SCSS sources
  less/     → LESS sources
  pug/      → mixins
fonts/      → font assets
docs/       → mixin documentation
```

---

## Build (For Contributors)

```bash
npm run build
```

Pipeline:

```text
clean → build:css → build:copy → build:ts
```

---

## License

ISC License
