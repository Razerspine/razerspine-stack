# Templates

`create` ships with production-ready SPA and MPA templates built on top of:

- `@razerspine/build`
- `@razerspine/ui`
- `@razerspine/runtime`

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
4. `package.json` is patched:
   - project name injected
   - scripts normalized for selected package manager
   - `packageManager` field added
5. Dependencies are installed (unless `--no-install`)

The result is a **fully standalone project**

---

## SPA Templates (Runtime Architecture)

SPA templates are powered by `@razerspine/runtime`

### Core Feature

- Router (client-side navigation)
- Component-based architecture
- Lifecycle hooks (`onInit`, `onDestroy`)
- Reactive Proxy-based state
- Automatic DOM bindings
- Dependency Injection (optional)

### Enty Point

```ts
bootstrapApplication({
  providers: [
    provideRouter(routes)
  ]
});
```

### Router Example

```ts
const routes = [
  {path: '/', component: HomePage},
  {path: '/dashboard', component: DashboardPage}
];
```

### SPA Lifecycle Flow

```text
Route change
  → destroy previous component
  → create new component
  → mount()
  → render()
  → bind events
  → applyBindings()
  → onInit()
```

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

## MPA Templates (Lightweight Reactive)

MPA templates use a simplified reactive layer from `@razerspine/runtime`.

### Core Features

- No router
- Multi-entry webpack configuration
- Independent pages
- Reactive store (Proxy-based)
- Manual lifecycle control

### Initialization Pattern

```ts
const {state} = createStore(initialState, () => update());
applyBindings(document.body, state);
```

### Lifecycle

```text
DOMContentLoaded
  → new Page()
  → createStore()
  → update()
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

### MPA Characteristics

- Each page is independent
- No shared router
- Explicit initialization
- Ideal for SEO-heavy projects

Best suited for:

- marketing websites
- landing pages
- static content-driven sites

---

## Template Philosophy

Templates are:

- copied (not referenced)
- fully standalone
- production-ready
- framework-independent
- easily extendable

After generation, your project:

- does NOT depend on the CLI
- does NOT include hidden runtime layers
- is safe for long-term maintenance

---

## Shared Packages

Generated projects depend on:

- `@razerspine/build` - webpack configuration and build system
- `@razerspine/runtime` - reactive engine and SPA runtime
- `@razerspine/ui` - UI components and styles

Installed as standard dependencies.

---

## Package Manager Integration

Templates are automatically adapted to the selected package manager:

- `npm`
- `pnpm`
- `yarn`
- `bun`

### What gets updated:

- `packageManager` field:
  ```json
  {
    "packageManager": "pnpm@latest"  
  }
  ```
- script prefixes:
  - `npm run build` → `pnpm build`
  - `npm run dev` → `yarn dev`
  - etc.

This ensures consistent DX across ecosystems.

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

Configured via webpack and supported in:

- Pug
- TypeScript / JavaScript
- SCSS / Less
