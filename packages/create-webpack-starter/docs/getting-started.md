# Getting Started

`create-webpack-starter` is a CLI tool to scaffold modern webpack-based projects using:

- Pug templating
- SCSS or Less
- JavaScript or TypeScript
- Production-ready SPA or MPA architecture
- Built-in reactive engine via `@razerspine/starter-core-scripts`

Generated projects are fully standalone and production-ready.

---

## Requirements

- Node.js >= 20
- npm (or pnpm / yarn)

---

## Create a project (Interactive Mode)

```bash
npx create-webpack-starter my-app
cd my-app
npm run dev
```

**You will be prompted to select**:

- Project type (SPA or MPA)
- Style preprocessor (SCSS or Less)
- Script language (JavaScript or TypeScript)

**The CLI will**:

1. Validate your choices
2. Resolve the internal template
3. Copy template files
4. Install dependencies
5. Prepare a ready-to-run project

---

## Non-interactive usage (CI / Automation)

```bash
npx create-webpack-starter my-app \
  --app-type spa \
  --style scss \
  --script ts \
  --no-install
```

All feature flags must be provided together when running non-interactively.

**Available flags**:

- `--app-type` → spa or mpa
- `--style` → scss or less
- `--script` → ts or js
- `--no-install` → skip dependency installation

---g

## Available scripts

After project creation:

```bash
npm run dev      # start webpack-dev-server
npm run build    # production build
npm run preview  # serve dist folder locally
```

---

## Project Types

### SPA (Single Page Application)

**SPA templates are powered by**:

- `Router` (Singleton-based navigation)
- `BaseComponent` lifecycle
- Proxy-based reactive store
- Automatic mount → render → bind → update flow

Navigation and lifecycle management are handled automatically.

### SPA Entry Point

```ts
new Router(routes);
```

**The Router**:

- Manages client-side navigation
- Updates browser history
- Automatically destroys previous components
- Calls `mount()` on new components
- Falls back to `render()` if no lifecycle is present

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

**Memory safety is ensured via**:

- cleanup registry
- delegated event binding
- automatic Proxy disconnect

### Typical SPA structure:

```text
my-app/
├── src
│   ├── assets
│   │   ├── i18n
│   │   ├── icons
│   │   ├── images
│   │   ├── scripts
│   │   │   ├── app.ts
│   │   │   └── routes.ts
│   │   └── styles
│   ├── types
│   └── views
│       ├── layout
│       ├── mixins
│       └── pages
│           ├── 404
│           └── home
├── package.json
├── tsconfig.json (if TS)
└── webpack.config.js
```

**Each SPA page:**

- Extends `BaseComponent`
- Implements `render()`
- Optionally overrides:
  - `onInit()`
  - `onDestroy()`

### Best suited for:

- Dashboards
- Admin panels
- Web applications
- Client-side rendered systems

---

### MPA (Multi Page Application)

**MPA templates use**:

- `createStore`
- `applyBindings`
- `bindClickEvents`
- `bindForms`
- Class-based reactivity
- No Router

Each page is built as an independent entry.

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

### Typical MPA structure:

```text
my-app/
├── src
│   ├── assets
│   └── views
│       ├── layout
│       ├── mixins
│       └── pages
│           ├── 404
│           └── home
├── package.json
└── webpack.config.js
```

**Each page**:

- Manually initializes reactivity
- Calls `applyBindings`
- Uses Proxy-based state
- Has no navigation layer

### MPA Best Suited For

- Marketing websites
- Landing pages
- Multi-page sites
- Static content-heavy projects

---

## How Template Resolution Works

Templates are resolved automatically based on selected flags:

- `--app-type`
- `--style`
- `--script`

Users never select template names directly.
The CLI maps feature combinations to internal templates.

---

## Shared Runtime Packages

**Generated projects depend on**:

- `@razerspine/webpack-core`
- `@razerspine/pug-ui-kit`
- `@razerspine/starter-core-scripts`

These are installed as normal semver dependencies.

---

## Next Steps After Creation

- Customize `webpack.config.js`
- Add new pages in `src/views/pages`
- Extend layout templates
- Modify router (SPA projects)
- Configure i18n
- Add API services

---

## Standalone Output

**Generated projects are fully independent**:

- No dependency on `create-webpack-starter`
- No hidden runtime
- No CLI coupling
- Safe to deploy immediately
