# Changelog

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
- **Build script**: Added a no-op `build` script (`echo "pug-ui-kit: nothing to build"`) to ensure compatibility with monorepo CI pipelines.

### Changed
- **Documentation**: Expanded `README.md` with full documentation of all available Pug mixins, including usage examples and configuration notes.

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
- **Variables**: Introduced $font-path (SCSS) and @font-path (LESS) variables to manage font asset resolution dynamically.
- **Styles**: Integrated @font-face declarations in base/_fonts.scss and base/_fonts.less

### Fixed
- **Assets**: Resolved "Module not found" errors in Webpack by using tilde-prefixed paths (~) for internal asset resolution.

### Migration Guide (Optional)
By default, the kit now looks for fonts inside the package.
If you wish to use a custom font path (e.g., a CDN or a different local folder), override the path variable before importing the kit:

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
- **dataTable**: The `options` parameter now accepts an `actions` array to define row actions (links/buttons) dynamically.

### Removed
- **dataTable**: Removed support for the Pug `block` (slot) content for rendering actions. The `showActions` boolean option has also been removed.

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
