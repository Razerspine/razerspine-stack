# @razerspine/ui

[![npm version](https://img.shields.io/npm/v/@razerspine/ui.svg)](https://www.npmjs.com/package/@razerspine/ui)
[![CI](https://github.com/Razerspine/razerspine-stack/actions/workflows/ci.yml/badge.svg)](https://github.com/Razerspine/razerspine-stack/actions)
[![changelog](https://img.shields.io/badge/docs-changelog-blue.svg)](./CHANGELOG.md)
[![license](https://img.shields.io/npm/l/@razerspine/ui.svg)](./LICENSE)

A modern, modular **UI layer for Pug-based applications**.
Provides a complete styling system (SCSS / LESS / CSS) and reusable Pug components.

- 🎨 Design tokens with Light / Dark themes out of the box
- 🔧 Fully overridable via `!default` variables (SCSS) and pre-declared variables (LESS)
- 📦 Tree-shakable SCSS architecture — import only what you need
- 🧩 Reusable Pug component mixins with optional reactive bindings

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#-quick-start)
  - [Use Compiled CSS](#use-compiled-css)
  - [Use SCSS](#use-scss)
  - [Use LESS](#use-less)
- [Styling System](#styling-system)
- [Customization](#customization)
- [Fonts](#fonts)
- [Modular Imports](#modular-imports-advanced)
- [Pug Components](#pug-components)
- [Documentation](#documentation)
- [Package Structure](#package-structure)
- [Build (Contributors)](#build-for-contributors)
- [License](#license)

---

## Installation

```bash
npm install @razerspine/ui
```

---

## ⚡ Quick Start

### Use Compiled CSS

Best for simple setups without preprocessors.

```text
@import "@razerspine/ui/css/ui.min.css";
```

✔ Autoprefixed
✔ Minified
✔ Ready for production

---

### Use SCSS

```text
@use "@razerspine/ui/scss" as *;
```

Override variables before importing:

```text
@use "@razerspine/ui/scss/settings" with (
  $font-path: "/my-fonts"
);

@use "@razerspine/ui/scss" as *;
```

---

### Use LESS

```text
@import "@razerspine/ui/less";
```

Override variables after importing (LESS lazy evaluation — last declaration wins):

```text
@import "@razerspine/ui/less";

@font-path: "/my-fonts";
```

---

## Styling System

The UI layer includes:

- Design tokens (color system, spacing, typography)
- Light / Dark themes (via CSS variables)
- Base reset
- Layout system (grid)
- UI components
- Utility classes (spacing, display, flex, grid, text, colors)

### Utility classes

Spacing utilities follow the pattern `.m-{direction}-{scale}` and `.p-{direction}-{scale}` with scale `0–4`.

Flex utilities cover the full flex model:

```text
.flex, .flex-row, .flex-column, .flex-center, .flex-between
.flex-wrap, .flex-nowrap, .flex-wrap-reverse
.flex-row-reverse, .flex-col-reverse
.items-start, .items-center, .items-end, .items-stretch, .items-baseline
.justify-start, .justify-center, .justify-end, .justify-between, .justify-around, .justify-evenly
.gap-{0-4}, .gap-x-{0-4}, .gap-y-{0-4}
.flex-1, .flex-auto, .flex-none, .grow, .grow-0, .shrink, .shrink-0
```

### Entry points

SCSS:

```text
@use "@razerspine/ui/scss" as *;
```

LESS:

```text
@import "@razerspine/ui/less";
```

---

## Customization

All SCSS design tokens use the `!default` flag — override any variable via `@use ... with (...)` without modifying package sources.

### Override theme tokens

```text
@use "@razerspine/ui/scss/themes" with (
  $brand-500: #7c3aed,
  $brand-600: #6d28d9,
  $light-bg-surface: #f8f8f8,
  $dark-bg-color: #0a0a0a
);

@use "@razerspine/ui/scss" as *;
```

### Override settings

```text
@use "@razerspine/ui/scss/settings" with (
  $font-family: ("Inter", system-ui, sans-serif), // parentheses required — comma is a with() param separator
  $base-font-size: 16px,
  $container-max: 1280px,
  $breakpoints: (
    sm: 640px,
    md: 768px,
    lg: 1024px,
    xl: 1280px
  )
);

@use "@razerspine/ui/scss" as *;
```

> ⚠ `$font-family` requires parentheses around the value. Without them, SCSS treats the comma as
> a parameter separator inside `with (...)` and throws a parse error.

### Available overridable variables

**Theme — Light:**
`$brand-50` – `$brand-900`, `$slate-50` – `$slate-900`,
`$success`, `$warning`, `$error`, `$info`,
`$light-shadow-sm`, `$light-shadow-md`, `$light-shadow-outline`,
`$light-icon-color`, `$light-bg-surface`, `$light-text-on-brand`

**Theme — Dark:**
`$dark-bg-color`, `$dark-bg-surface`, `$dark-bg-subtle`,
`$dark-text-primary`, `$dark-text-secondary`, `$dark-text-disabled`, `$dark-text-on-brand`,
`$dark-success`, `$dark-error`,
`$dark-border-subtle`, `$dark-border-strong`,
`$dark-shadow-sm`, `$dark-shadow-md`, `$dark-shadow-outline`, `$dark-icon-color`

**Settings:**
`$container-max`, `$columns`, `$gutter`, `$border-radius`,
`$aside-ratio`, `$main-ratio`, `$aside-min`, `$main-min`,
`$font-path`, `$font-family`, `$base-font-size`, `$breakpoints`

### LESS overrides

In LESS, declare overrides **after** the import. LESS uses lazy evaluation — variables are resolved
at the point of use, so the last declaration in scope wins:

```text
@import "@razerspine/ui/less";

@brand-500: #7c3aed;
@font-family: "Inter", system-ui, sans-serif;
@container-max: 1280px;
```

> ⚠ This is the opposite of SCSS — in SCSS overrides go **before** the import via `@use ... with (...)`,
> in LESS they go **after**.

---

## Fonts

Fonts are **optional and not auto-included**.

### Use bundled Roboto

SCSS:

```text
@use "@razerspine/ui/scss/fonts";
@use "@razerspine/ui/scss" as *;
```

LESS:

```text
@import "@razerspine/ui/less/fonts";
@import "@razerspine/ui/less";
```

### Use custom font

SCSS:

```text
@use "@razerspine/ui/scss" with (
  $font-family: ("Inter", system-ui, sans-serif)
);
```

LESS:

```text
@font-family: "Inter", system-ui, sans-serif;
@import "@razerspine/ui/less";
```

---

## Modular Imports (Advanced)

The SCSS architecture is fully modular — import only the layers you need.

```text
scss/
  base/         → reset, fonts
  settings/     → tokens, breakpoints, typography
  themes/       → light and dark theme variables
  layout/       → grid, layout
  components/   → buttons, forms, table, inputs, select...
  utils/        → helpers, mixins, utilities, icons
```

Examples:

```text
// Only settings and components — no layout, no reset
@use "@razerspine/ui/scss/settings" as *;
@use "@razerspine/ui/scss/components";
```

```text
// Only utilities (spacing, flex, display)
@use "@razerspine/ui/scss/utils";
```

```text
// Only theme tokens
@use "@razerspine/ui/scss/themes";
```

> ⚠ When using partial imports, you must include dependencies manually. For example, `components` requires `settings` and `themes` to be loaded first.

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

- [Button](https://github.com/Razerspine/razerspine-stack/blob/main/packages/ui/docs/btn.md)
- [Data Table](https://github.com/Razerspine/razerspine-stack/blob/main/packages/ui/docs/data-table.md)
- [Form Input](https://github.com/Razerspine/razerspine-stack/blob/main/packages/ui/docs/form-input.md)
- [Textarea](https://github.com/Razerspine/razerspine-stack/blob/main/packages/ui/docs/form-textarea.md)
- [Checkbox](https://github.com/Razerspine/razerspine-stack/blob/main/packages/ui/docs/input-checkbox.md)
- [Radio](https://github.com/Razerspine/razerspine-stack/blob/main/packages/ui/docs/input-radio.md)
- [Single Select](https://github.com/Razerspine/razerspine-stack/blob/main/packages/ui/docs/single-select.md)

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

### Validate LESS

LESS compilation is not part of the main build. Run separately to catch errors:

```bash
npm run check:less
```

---

## License

ISC License
