# Getting Started

`create-webpack-starter` is a CLI tool to scaffold modern webpack-based projects using Pug templates and production-ready SPA or MPA architectures.

---

## Requirements

- Node.js >= 18
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

- Resolve the correct internal template
- Copy all template files
- Install dependencies
- Prepare a ready-to-run project

---

## Non-interactive usage (CI / automation)

```bash
npx create-webpack-starter my-app \
  --app-type spa \
  --style scss \
  --script ts \
  --no-install
```

All feature flags must be provided together when running non-interactively.

---

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

Designed for applications with client-side routing.

**Includes**:

- Router setup
- App bootstrap file (`app.ts` or `app.js`)
- Modular page structure
- Layout system
- i18n-ready structure
- Optimized webpack configuration

Typical SPA structure:

```text
my-app/
├── src
│   ├── assets
│   │   ├── i18n
│   │   ├── icons
│   │   ├── images
│   │   ├── scripts
│   │   │   ├── app.ts
│   │   │   ├── router.ts
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

**Best suited for**:

- dashboards
- admin panels
- web applications
- client-side rendered projects

### MPA (Multi Page Application)

Designed for traditional multipage websites.

**Includes**:

- Multiple page entries
- Static HTML generation per page
- SEO-friendly structure
- Independent page scripts and styles

**Typical MPA structure**:

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

**Best suited for**:

- marketing websites
- landing pages
- multi-page sites
- static content-driven projects

---

## How Template Resolution Works

Templates are resolved automatically based on selected flags:

- `--app-type`
- `--style`
- `--script`

Users never select template names directly.
The CLI maps feature combinations to internal templates.

---

## Next Steps After Creation

- Customize `webpack.config.js`
- Configure path aliases
- Extend layout templates
- Add new pages in `src/views/pages`
- Modify router (for SPA projects)

---

## Standalone Output

Generated projects are fully independent:

- No dependency on `create-webpack-starter`
- No hidden runtime requirements
- Safe to deploy immediately
