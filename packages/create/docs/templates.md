# Templates

`create-webpack-starter` ships with production-ready SPA and MPA templates built on top of:

- `@razerspine/webpack-core`
- `@razerspine/pug-ui-kit`
- `@razerspine/starter-core-scripts`

Templates are resolved automatically based on three dimensions:

- `--app-type`
- `--style`
- `--script`

Users do **not** select template names directly.

---

## Template Matrix

| App Type | Style | Script | Internal Key      |
|----------|-------|--------|-------------------|
| SPA      | SCSS  | TS     | `spa-pug-scss-ts` |
| SPA      | SCSS  | JS     | `spa-pug-scss-js` |
| SPA      | Less  | TS     | `spa-pug-less-ts` |
| SPA      | Less  | JS     | `spa-pug-less-js` |
| MPA      | SCSS  | TS     | `mpa-pug-scss-ts` |
| MPA      | SCSS  | JS     | `mpa-pug-scss-js` |
| MPA      | Less  | TS     | `mpa-pug-less-ts` |
| MPA      | Less  | JS     | `mpa-pug-less-js` |

Template keys are considered **internal implementation details**.

---

## How Resolution Works

1. CLI validates feature flags
2. CLI derives internal template key
3. Template files are copied
4. Dependencies are installed
5. Project becomes fully standalone

In non-interactive mode, all feature flags must be provided.

---

## SPA Templates (v0.4.0 Architecture)

SPA templates are powered by:

- `Router` (Singleton pattern)
- `BaseComponent` lifecycle
- Reactive Proxy store
- Automatic mount → render → bind → update orchestration

### Enty Point

```ts
new Router(routes);
```

**The Router**:

- Handles navigation
- Updates browser history
- Manages component lifecycle
- Automatically calls:
- `mount()` (if available)
- `render()` (fallback)
- `destroy()` (on route change)

### SPA Lifecycle Flow

```text
Route change
  ↓
destroy() previous component
  ↓
new Component(root)
  ↓
mount()
  ↓
render()
  ↓
initEventListeners()
  ↓
update()
  ↓
onInit()
```

**Memory safety is guaranteed via**:

- `cleanupCallbacks` registry
- automatic `Proxy` disconnect
- delegated event binding

### SPA Project Structure

**Typical structure**:

```text
src/
  app/
    app.ts
    routes.ts
    app.pug
  pages/
    home/
    not-found/
  shared/
    layout/
    mixins/
  assets/
    i18n/
    icons/
    images/
  styles/
    main.scss
  types/
```

**Each page**:

- Extends `BaseComponent`
- Implements render()
- Optionally overrides `onInit()` and `onDestroy()`

Architecture improvements:

- feature-based pages
- shared UI layer
- centralized bootstrap
- clear separation of application logic and UI

### SPA Capabilities

- Client-side navigation
- Declarative navigation via `[data-link]`
- Programmatic navigation via `Router.navigate()`
- Reactive DOM binding:
  - `data-bind`
  - `data-model`
  - `data-show`
  - `data-class`
  - `data-for`
- Automatic memory cleanup
- Hybrid SPA/MPA-ready architecture

SPA templates are optimized for application-like behavior.

---

## MPA Templates (Reactive, No Router)

**MPA templates use**:

- `createStore`
- `applyBindings`
- `bindClickEvents`
- `bindForms`
- Class-based state management
- No Router

Each page is independently rendered by webpack multi-entry.

### MPA Initialization Pattern

```ts
const { state } = createStore(initialState, () => update());
applyBindings(document.body, state);
```

**Lifecycle**:

```text
DOMContentLoaded
  ↓
new PageClass()
  ↓
createStore()
  ↓
update()
```

### MPA Project Structure

```text
src/
  views/
    pages/
      home/
        home.ts
        home.pug
        style.scss
```

**Each page**:

- Manually initializes reactivity
- Calls `applyBindings`
- Uses Proxy-based store
- Has no navigation system

**MPA is optimized for**:

- Traditional multi-page websites
- SEO-heavy projects
- Independent entry points

---

## Template Philosophy

Templates are:

- Copied (not referenced)
- Fully standalone
- Production-ready
- Memory-safe
- Extendable
- Not coupled to CLI runtime

---

## Shared Runtime Packages

Generated projects depend on:

- `@razerspine/webpack-core`
- `@razerspine/pug-ui-kit`
- `@razerspine/starter-core-scripts`

These are installed as normal semver dependencies.

---

## Aliases

**Available out of the box**:

```text
@views
@styles
@scripts
@images
@fonts
@icons
```

**Configured via webpack and ready for**:

- Pug
- TypeScript / JavaScript
- SCSS / Less
