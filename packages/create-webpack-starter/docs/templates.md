# Templates

`create-webpack-starter` ships with production-ready templates
based on real webpack configurations.

Templates are resolved automatically based on selected features.

---

## Feature Matrix

| Style | Script | Template Key    |
|-------|--------|-----------------|
| Less  | JS     | `pug-less-js`   |
| Less  | TS     | `pug-less-ts`   |
| SCSS  | JS     | `pug-scss-js`   |
| SCSS  | TS     | `pug-scss-ts`   |

Users do **not** select template names directly.

The CLI resolves the correct template internally using:

- `--style`
- `--script`

Both flags must be provided together in non-interactive mode.

---

## How Template Resolution Works

1. User selects: style preprocessor and script language
2. CLI validates the flags
3. Template key is derived internally
4. Template is copied into the target directory

Template names are considered **internal implementation details**.

---

## Template Contents

Each template includes:

- Fully configured `webpack.config.js`
- Production-ready loader setup
- Folder structure
- Pug integration
- Asset handling
- Aliases configuration
- Integration with `@razerspine/webpack-core`

Templates are **copied**, not referenced.

The generated project is fully standalone.

---

## Shared Runtime Packages

All templates depend on official shared packages:

- `@razerspine/webpack-core`
- `@razerspine/pug-ui-kit`
- `@razerspine/starter-core-scripts`

### starter-core-scripts provides:

- ThemeService
- TranslationService
- ApiService
- ConsoleLogger

These are installed as regular semver dependencies in the generated project.

---

## Aliases

Common aliases available in Pug, JS, and styles:

```
@views
@styles
@scripts
@images
@fonts
@icons
```

These aliases are configured via webpack and available out of the box.
