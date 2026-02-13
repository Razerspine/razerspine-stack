# Templates

`create-webpack-starter` ships with ready-to-use templates based on real
production setups.

---

## Available templates

| Template        | Pug | Styles | Scripts |
|-----------------|-----|--------|---------|
| pug-less-js     | ✅  | Less   | JS      |
| pug-less-ts     | ✅  | Less   | TS      |
| pug-scss-js     | ✅  | SCSS   | JS      |
| pug-scss-ts     | ✅  | SCSS   | TS      |

---

## Template resolution

By default, users do **not** select templates directly.

The CLI resolves the correct template automatically based on:

- selected style preprocessor (`--style`)
- selected script language (`--script`)

Explicit template selection via `--template` is supported but deprecated.

New projects should prefer `--style` and `--script`,
which allow the CLI to resolve templates automatically.


## How templates work

Each template provides:
- A complete `webpack.config.js`
- Folder structure
- Preconfigured loaders
- Aliases for assets and views
- Integration with `@razerspine/webpack-core`

Templates are **copied**, not referenced — you fully own the result.

---

## Shared runtime packages

All templates depend on official shared packages:

- `@razerspine/webpack-core`
- `@razerspine/pug-ui-kit`
- `@razerspine/starter-core-scripts`

`starter-core-scripts` provides:

- ThemeService
- TranslationService
- ApiService
- ConsoleLogger

These packages are regular npm dependencies.
They are copied as semver dependencies into the generated project.

---

## Aliases in templates

Common aliases available in Pug, JS, and styles:

```text
@views
@styles
@scripts
@images
@fonts
@icons
```
