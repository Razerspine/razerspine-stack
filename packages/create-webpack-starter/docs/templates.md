# Templates

`create-webpack-starter` ships with production-ready SPA and MPA templates.

Templates are resolved automatically based on three dimensions:

- `--app-type`
- `--style`
- `--script`

Users do **not** select template names directly.

---

## Template Matrix

| App Type | Style | Script | Internal Key |
|----------|--------|--------|--------------|
| SPA      | SCSS   | TS     | `spa-pug-scss-ts` |
| SPA      | SCSS   | JS     | `spa-pug-scss-js` |
| SPA      | Less   | TS     | `spa-pug-less-ts` |
| SPA      | Less   | JS     | `spa-pug-less-js` |
| MPA      | SCSS   | TS     | `mpa-pug-scss-ts` |
| MPA      | SCSS   | JS     | `mpa-pug-scss-js` |
| MPA      | Less   | TS     | `mpa-pug-less-ts` |
| MPA      | Less   | JS     | `mpa-pug-less-js` |

Template keys are considered **internal implementation details**.

---

## How Resolution Works

1. CLI validates flags
2. CLI derives internal template key
3. Template files are copied
4. Dependencies are installed

In non-interactive mode, all feature flags must be provided.

---

## SPA Template Structure

SPA templates include:

- Router setup
- `app.ts` / `app.js` entry
- Modular page folders
- Layout system
- i18n-ready structure
- Production webpack configuration

SPA is optimized for application-like behavior.

---

## MPA Template Structure

MPA templates include:

- Multi-entry configuration
- Independent page outputs
- Static HTML generation
- SEO-friendly setup

MPA is optimized for traditional websites.

---

## Template Philosophy

Templates are:

- Copied (not referenced)
- Fully standalone
- Production-ready
- Extendable
- Free from CLI runtime coupling

---

## Shared Runtime Packages

Generated projects depend on:

- `@razerspine/webpack-core`
- `@razerspine/pug-ui-kit`
- `@razerspine/starter-core-scripts`

These are installed as normal semver dependencies.

---

## Aliases

Available out of the box:

```text
@views
@styles
@scripts
@images
@fonts
@icons
```

Configured via webpack and ready for use in Pug, JS, and styles.
