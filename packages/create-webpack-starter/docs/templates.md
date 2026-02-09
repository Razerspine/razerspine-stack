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

## How templates work

Each template provides:
- A complete `webpack.config.js`
- Folder structure
- Preconfigured loaders
- Aliases for assets and views
- Integration with `@razerspine/webpack-core`

Templates are **copied**, not referenced — you fully own the result.

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
