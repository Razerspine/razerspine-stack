# Changelog

## [1.5.1] - 2026-02-23

### Fixed

- LESS Grid System (Mobile-First Order)
- Fixed a critical bug in the LESS version where md classes would override lg classes due to incorrect recursion order.
- Refactored .generate-responsive and .generate-offset-bp to generate media queries in ascending order (sm → xl), ensuring proper CSS cascade.

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
    ```scss
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

```scss
@use "@razerspine/pug-ui-kit/scss/settings" with (
  $font-path: "/my-custom-path/fonts"
);
```

#### LESS:

```less
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
