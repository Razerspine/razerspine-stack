# Changelog

# [1.0.2] - 2026-04-04

### Added

- **Flex utilities** — extended `.flex-*` utility classes in both SCSS and LESS:
  - Direction: `.flex-row-reverse`, `.flex-col-reverse`
  - Wrap: `.flex-wrap`, `.flex-nowrap`, `.flex-wrap-reverse`
  - Align items: `.items-start`, `.items-center`, `.items-end`, `.items-stretch`, `.items-baseline`
  - Justify content: `.justify-start`, `.justify-center`, `.justify-end`, `.justify-between`, `.justify-around`, `.justify-evenly`
  - Gap: `.gap-{0-4}`, `.gap-x-{0-4}`, `.gap-y-{0-4}` (uses existing space scale)
  - Grow / shrink: `.flex-1`, `.flex-auto`, `.flex-none`, `.grow`, `.grow-0`, `.shrink`, `.shrink-0`

- **LESS validation script** — `scripts/check-less.ts` compiles `ui.less` via `lessc` and exits with code `1` on error.
  Run via `npm run check:less`. Intended for manual use and CI pipelines; not part of the main build.

### Changed

- **SCSS theme variables** — all design tokens in `themes/` and `settings/` now use the `!default` flag,
  enabling full override via `@use ... with (...)`:
  - Light theme: brand palette, neutral palette, status colors, shadow, icon color, surface tokens
  - Dark theme: background, text, border, shadow, icon color tokens
  - Settings: `$container-max`, `$columns`, `$gutter`, `$border-radius`, `$aside-ratio`, `$main-ratio`,
    `$aside-min`, `$main-min`, `$font-path`, `$font-family`, `$base-font-size`, `$breakpoints`

### Fixed

- **LESS `svg-encode` mixin** — eliminated `NameError: Recursive variable definition for @svg`.
  Refactored `_helpers.less` to use intermediate variables `@svg-1..@svg-4` with result exposed
  as `@svg-encoded`. Updated `_icons.less` to use `@svg-raw` as input and `@svg-encoded` as output.

- **LESS margin/padding generation** — eliminated IDE `Cannot find variable 'space-value'` warning.
  Refactored `_utilities.less`: extracted `.generate-mp-with-value(@s, @val)` and
  `.generate-gap-with-value(@s, @val)` mixins that receive the resolved value as an explicit parameter,
  making variable scope visible to static analysis tools.

---

# [1.0.1] - 2026-03-31

### Changed

- Updated repository links in `package.json` following the monorepo renaming.

### Fixed

- Corrected typos and grammatical errors in `README.md`.

---

## [1.0.0] - 2026-03-24

### 🚀 Major Refactor & Stabilization

This release introduces a complete internal refactor of the package, transforming it into a structured, production-ready
UI distribution layer with a fully deterministic build system and improved testing strategy.

---

### ⚠️ Breaking Changes

- Renamed package:
  - `@razerspine/pug-ui-kit` → `@razerspine/ui`

- Renamed entry files:
  - `ui-kit.scss` → `ui.scss`
  - `ui-kit.less` → `ui.less`

- SCSS/LESS imports updated:
  - Now strictly rely on the `exports` field
  - Deep imports outside defined exports are no longer supported

- Pug components API updated:
  - Introduced `bindings` param
  - Components now support optional runtime bindings via `data-*` attributes

---

### Architecture

- Introduced clear separation of concerns:
  - `src/` — source files (SCSS, LESS, Pug)
  - `scripts/` — build tools (dev-only)
  - `dist/` — final distributable output

- `scripts` directory:
  - Not compiled
  - Not included in published package
  - Used only during build via `tsx`

---

### CSS Build Pipeline

- Fully redesigned build pipeline:

```text
SCSS → CSS → PostCSS → Minified CSS
```

- Integrated:
  - Autoprefixer
  - cssnano (minification)
- Output:
  - `dist/css/ui.css`
  - `dist/css/ui.min.css`

---

### Assets Pipeline

- Implemented centralized asset distribution:
  - `src/styles/scss` → `dist/scss`
  - `src/styles/less` → `dist/less`
  - `src/pug` → `dist/pug`
- Copy behavior:
  - Recursive
  - Excludes `.map` files

---

### Build System

- Introduced deterministic build pipeline:

```text
clean → build:css → build:copy → build:ts
```

- Build scripts:
  - Executed via `tsx`
  - No runtime dependency on compiled `dist` scripts

---

### Testing

- Restructured testing strategy:
  - `integration`:
    - `base`
    - `runtime`
    - `static`
  - `snapshots`
- Added full test pipeline:

```bash
npm run test:full
```

- Updated fixtures:
  - `with-runtime`
  - `without-runtime`
  - Improved coverage for real-world usage scenarios

---

### Snapshot Testing

- Reworked snapshot system:
  - Normalization:
    - CSS (removes sourcemaps, whitespace)
    - SCSS/LESS (removes comments, formatting)
  - Coverage:
    - Compiled CSS (`ui.css`)
    - Entry files (`ui.scss`, `ui.less`)
  - Structured directories:
    - `settings`
    - `themes`
    - `components`
  - Ensures:
    - Output stability
    - Safe refactoring of styles and tokens

---

### Package Exports

- Stabilized public API via exports:
  - `.`
  - `./scss`
  - `./scss/*`
  - `./less`
  - `./less/*`
  - `./mixins/*`
  - `./fonts/*`
  - `./css/*`
- Added style entry:
  - `dist/css/ui.min.css`

---

### Documentation

- Added dedicated documentation for all Pug mixins:

```text
docs/
  btn.md
  data-table.md
  form-input.md
  form-textarea.md
  input-checkbox.md
  input-radio.md
  single-select.md
```

---

### Positioning

The package is now a unified UI layer that provides:

- UI Kit (compiled CSS + design tokens)
- SCSS/LESS source distribution
- Pug component library

Designed for:

- Webpack templates
- Design systems
- Runtime-agnostic UI development

--------------------------------------------

# Legacy

## [1.5.1] - 2026-02-23

### Fixed

- LESS Grid System (Mobile-First Order)
- Fixed a critical bug in the LESS version where md classes would override lg classes due to incorrect recursion order.
- Refactored .generate-responsive and .generate-offset-bp to generate media queries in ascending order (sm → xl),
  ensuring proper CSS cascade.

---

## [1.5.0] - 2026-02-19

### Added

- **New Color Palette (Modern Indigo & Zinc)**
  - Switched primary brand colors to a modern **Indigo** scale (50-900).
  - Replaced Slate with a cleaner **Zinc/Neutral** scale for surfaces and text.
- **Enhanced Customization (SCSS)**
  - All theme variables now use the `!default` flag, allowing full overrides via `@use ... with`.
- **Theme Variable Bridge**
  - Integrated a robust mapping between preprocessor variables (SCSS/LESS) and native CSS custom properties.

### Changed

- **Dark Theme Refactor**
  - Deepened dark mode background to a more modern `#09090b` (Zinc 950).
  - Refined `bg-surface` and `bg-subtle` for better component elevation.
  - Improved border contrast and text legibility in dark mode.
- **LESS/SCSS Parity**
  - Fully synchronized variable naming and logic between SCSS and LESS versions of the kit.
- **Optimized UI Assets**
  - Updated inline SVG variables (`--select-arrow`, `--checkbox-icon`, etc.) with theme-aware colors for better
    visibility.

### Notes

- This is a visual-heavy update. While CSS variable names remain the same (ensuring backward compatibility), the hex
  values have been significantly updated to provide a more professional look.
- Documentation in `README.md` updated to reflect new customization capabilities.

---

## [1.4.1] - 2026-02-14

### Added

- **Structured README.md** — added a new structured `README.md`

### Notes

- Documentation changes do not affect runtime behavior; they simplify migration and configuration for SCSS/LESS users.

---

## [1.4.0] - 2026-02-14

### Changed

- **Font Architecture Refactor**
  - Removed automatic `@font-face` injection from `ui-kit` entry.
  - Font declarations moved to a separate optional layer:
    - `scss/fonts.scss`
    - `less/fonts.less`
- Improved flexibility for custom typography setups.
- Prevented unintended font bundling in advanced projects.

### Added

- New optional font entry files:
  - `@razerspine/pug-ui-kit/scss/fonts`
  - `@razerspine/pug-ui-kit/less/fonts`
- Explicit documentation for typography variables:
  - `$font-family`
  - `$base-font-size`
  - `@font-family`
  - `@base-font-size`

### Notes

- No breaking changes for users importing compiled CSS (`style/style.css` or `style.min.css`).
- SCSS/LESS users who relied on automatic Roboto injection must now explicitly import the fonts layer.
- Update README.md

---

## [1.3.1] - 2026-02-11

### Fixed

- Fixed broken SCSS imports caused by incorrect "exports" configuration in v1.3.0.
- Restored compatibility with sass-loader and webpack.

---

## [1.3.0] - 2026-02-11

### Added

- **Production CSS build pipeline**
  - Compiles SCSS into `style/style.css`
  - Generates minified version `style/style.min.css`
  - Adds vendor prefixes via PostCSS + Autoprefixer
- **New build scripts**
  - `clean`
  - `build:css`
  - `build:postcss`
  - `build` (full pipeline)
- **Distributable CSS output**
  - Users can now import compiled CSS directly:
    ```text
    @import "@razerspine/pug-ui-kit/style/style.min.css";
    ```

### Changed

- Migrated SCSS utilities to modern Dart Sass syntax
  - Replaced deprecated global built-in functions
  - Removed deprecated `if()` Sass function usage
  - Updated `map-get` → `map.get`
- Improved forward-compatibility with Dart Sass 3.0+

### Notes

- No breaking changes.
- Existing SCSS/LESS usage remains fully supported.
- CSS build output is optional — advanced users can still consume SCSS/LESS sources directly.

---

## [1.2.2] - 2026-02-08

### Added

- **Build script**: Added a no-op `build` script (`echo "pug-ui-kit: nothing to build"`) to ensure compatibility with
  monorepo CI pipelines.

### Changed

- **Documentation**: Expanded `README.md` with full documentation of all available Pug mixins, including usage examples
  and configuration notes.

### Notes

- This release does not change runtime behavior.
- The update ensures smooth CI execution when building all workspace packages together.

---

## [1.2.1] - 2026-02-03

### Fixed

- **SCSS Scope**: Fixed "Undefined variable" error in `_fonts.scss` by explicitly importing settings module via `@use`.

---

## [1.2.0] - 2026-02-03

### Added

- **Fonts**: Added local Roboto font family (Thin, Light, Regular, Medium, Bold, Black) directly into the package.
- **Variables**: Introduced $font-path (SCSS) and @font-path (LESS) variables to manage font asset resolution
  dynamically.
- **Styles**: Integrated @font-face declarations in base/_fonts.scss and base/_fonts.less

### Fixed

- **Assets**: Resolved "Module not found" errors in Webpack by using tilde-prefixed paths (~) for internal asset
  resolution.

### Migration Guide (Optional)

By default, the kit now looks for fonts inside the package.
If you wish to use a custom font path (e.g., a CDN or a different local folder), override the path variable before
importing the kit:

#### SCSS:

```text
@use "@razerspine/pug-ui-kit/scss/settings" with (
  $font-path: "/my-custom-path/fonts"
);
```

#### LESS:

```text
@font-path: "/my-custom-path/fonts";
@import "@razerspine/pug-ui-kit/less/ui-kit.less";
```

---

## [1.1.0] - 2026-02-03

### Added

- **Styles**: Full SCSS and LESS support for all UI components.
- **Architecture**: Added global settings, grid system, and themes (light/dark).

---

## [1.0.1] - 2026-02-03

### Changed

- **dataTable**: Refactored the `dataTable` mixin to improve configuration consistency.
- **dataTable**: The `options` parameter now accepts an `actions` array to define row actions (links/buttons)
  dynamically.

### Removed

- **dataTable**: Removed support for the Pug `block` (slot) content for rendering actions. The `showActions` boolean
  option has also been removed.

### Migration Guide

If you were using the block content for actions:

```pug
// Old version (v1.0.0)
+dataTable(items, cols, { showActions: true })
  a(href=`/edit/${item.id}`) Edit
```

You should now update to:

```pug
// New version (v1.0.1)
+dataTable(items, cols, {
  actions: [
    { label: 'Edit', url: (item) => `/edit/${item.id}` }
  ]
})
```
