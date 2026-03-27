# create-webpack-starter

[![npm version](https://img.shields.io/npm/v/create-webpack-starter.svg)](https://www.npmjs.com/package/create-webpack-starter)
[![changelog](https://img.shields.io/badge/docs-changelog-blue.svg)](./CHANGELOG.md)
[![license](https://img.shields.io/npm/l/create-webpack-starter.svg)](./LICENSE)

Scaffold a modern webpack project using production-ready **SPA or MPA templates** powered by the Razerspine frontend ecosystem.

Built on top of:

- `@razerspine/webpack-core`
- `@razerspine/pug-ui-kit`
- `@razerspine/starter-core-scripts`

Supports modern deployment platforms and includes a lightweight SPA runtime architecture.

> ⚠️ Versions prior to **1.1.0** do not include SPA support.

---

## 🚀 Quick Start

```bash
npx create-webpack-starter my-app
```

Starts an interactive setup where you choose:

- Project type (**SPA** or **MPA**)
- Style preprocessor (**SCSS** or **Less**)
- Script language (**JavaScript** or **TypeScript**)

---

## ⚙️ Non-interactive Usage (CI Friendly)

```bash
npx create-webpack-starter my-app \
  --app-type spa \
  --style scss \
  --script ts \
  --no-install
```

All feature flags must be provided together in non-interactive mode.

---

## 🧩 CLI Options

| Option                    | Description                        |
| ------------------------- | ---------------------------------- |
| `--app-type <spa \| mpa>` | Project architecture               |
| `--style <scss \| less>`  | CSS preprocessor                   |
| `--script <js \| ts>`     | Script language                    |
| `--no-install`            | Skip dependency installation       |
| `--dry-run`               | Show actions without writing files |
| `-v`, `--version`         | Show CLI version                   |

---

## 🌍 Automated Hosting Support

Production builds automatically generate deployment configuration files based on the detected hosting environment.

Supported platforms:

- **Netlify**
- **Vercel**
- **Cloudflare Pages**
- **GitHub Pages**
- **Generic static hosting**

Generated files:

| Platform             | Generated File          |
| -------------------- | ----------------------- |
| Netlify / Cloudflare | `_redirects`            |
| Vercel               | `vercel.json`           |
| GitHub Pages         | `404.html` SPA fallback |
| Static hosting       | `404.html` SPA fallback |

Hosting detection uses environment variables automatically provided by hosting providers.

Example:

```bash
NETLIFY=true npm run build
```

---

## 🏗 Project Architectures

### SPA (Single Page Application)

SPA templates include a **lightweight runtime architecture** powered by
`@razerspine/starter-core-scripts`.

#### Core features

- Dependency Injection container
- SPA Router
- Route Guards (`canActivate`)
- Component lifecycle
- Declarative navigation
- Proxy-based reactive state

#### Application Bootstrap

```ts
bootstrapApplication({
  providers: [
    provideRouter(routes),
    { provide: ThemeService, useValue: themeService },
    { provide: ConsoleLogger, useValue: logger }
  ]
});
```

#### Component Example

```ts
export class HomePage extends BaseComponent<HomeState> {

  private logger = inject(ConsoleLogger);

  protected onInit() {
    this.logger.success('Home Page initialized!');
  }

}
```

#### Router Guards

Guards control navigation before routes activate.

```ts
const routes: Route[] = [
  { path: '/', component: HomePage },
  { path: '/dashboard', component: DashboardPage, canActivate: [authGuard] }
];
```

Guard example:

```ts
const authGuard: CanActivateFn = () => {
  const isLoggedIn = checkAuth();
  return isLoggedIn ? true : '/login';
};
```

Guard return values:

| Return    | Result           |
| --------- | ---------------- |
| `true`    | allow navigation |
| `false`   | block navigation |
| `string`  | redirect         |
| `Promise` | async guard      |

---

## SPA Lifecycle

```text
Route change
  ↓
run route guards
  ↓
destroy() previous page
  ↓
instantiate new page
  ↓
mount() or render()
  ↓
bind events
  ↓
onInit()
```

Lifecycle cleanup is handled automatically.

---

## MPA (Multi Page Application)

MPA templates provide a classic multi-page architecture.

Features:

- Multi-entry webpack setup
- Independent page scripts
- Reactive state via `createStore`
- Optional event helpers

Best suited for:

- marketing sites
- landing pages
- traditional websites

---

## 📁 Generated Project Structure

Example SPA structure:

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
    images/
    icons/
    i18n/

  styles/
    main.scss

  types/
```

Generated projects are:

- fully standalone
- independent of the CLI
- production-ready
- safe to deploy immediately

---

## 📦 Template Resolution

Templates are resolved automatically from selected flags.

| Type | Style | Script | Template          |
| ---- | ----- | ------ | ----------------- |
| SPA  | SCSS  | TS     | `spa-pug-scss-ts` |
| SPA  | SCSS  | JS     | `spa-pug-scss-js` |
| SPA  | Less  | TS     | `spa-pug-less-ts` |
| SPA  | Less  | JS     | `spa-pug-less-js` |
| MPA  | SCSS  | TS     | `mpa-pug-scss-ts` |
| MPA  | SCSS  | JS     | `mpa-pug-scss-js` |
| MPA  | Less  | TS     | `mpa-pug-less-ts` |
| MPA  | Less  | JS     | `mpa-pug-less-js` |

Users never choose templates directly.

The CLI resolves the correct one automatically.

---

## 🎁 What You Get

- Production-grade webpack configuration
- Pug template system
- SCSS or Less support
- JavaScript or TypeScript support
- SPA Router
- Route Guards
- Dependency Injection container
- Reactive View Engine
- Clean scalable architecture
- Production deployment automation

---

## 📚 Documentation

Detailed documentation is available in the `/docs` directory:

- [Getting Started](https://github.com/Razerspine/webpack-starter-monorepo/blob/main/packages/create-webpack-starter/docs/getting-started.md)
- [Templates](https://github.com/Razerspine/webpack-starter-monorepo/blob/main/packages/create-webpack-starter/docs/templates.md)
- [SPA Examples](https://github.com/Razerspine/webpack-starter-monorepo/blob/main/packages/create-webpack-starter/docs/spa-examples.md)
- [MPA Examples](http://github.com/Razerspine/webpack-starter-monorepo/blob/main/packages/create-webpack-starter/docs/mpa-examples.md)
- [webpack-core](https://github.com/Razerspine/webpack-starter-monorepo/blob/main/packages/create-webpack-starter/docs/webpack-core.md)
- [FAQ](https://github.com/Razerspine/webpack-starter-monorepo/blob/main/packages/create-webpack-starter/docs/faq.md)
- [Testing](https://github.com/Razerspine/webpack-starter-monorepo/blob/main/packages/create-webpack-starter/docs/testing.md)

---

## 🧪 Testing

The project includes end-to-end tests verifying:

- scaffolding
- CLI flags
- dry-run behavior
- template resolution
- filesystem output

Tests simulate real `npx` usage.

---

## 📋 Requirements

- **Node.js ≥ 20**
- npm / pnpm / yarn

---

## 🛠 How It Works

1. CLI validates feature flags
2. Template is resolved internally
3. Files are copied
4. Dependencies are installed
5. Project is ready to run

---

## 📄 License

ISC License
