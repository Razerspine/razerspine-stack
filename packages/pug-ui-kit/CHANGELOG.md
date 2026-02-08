# Changelog

## [1.2.2] - 2026-02-08

### Added
- **Build script**: Added a no-op `build` script (`echo "pug-ui-kit: nothing to build"`) to ensure compatibility with monorepo CI pipelines.

### Changed
- **Documentation**: Expanded `README.md` with full documentation of all available Pug mixins, including usage examples and configuration notes.

### Notes
- This release does not change runtime behavior.
- The update ensures smooth CI execution when building all workspace packages together.

## [1.2.1] - 2026-02-03

### Fixed
- **SCSS Scope**: Fixed "Undefined variable" error in `_fonts.scss` by explicitly importing settings module via `@use`.

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

## [1.1.0] - 2026-02-03
### Added
- **Styles**: Full SCSS and LESS support for all UI components.
- **Architecture**: Added global settings, grid system, and themes (light/dark).

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
