# Razerspine SPA Template

![Webpack](https://img.shields.io/badge/Webpack-5-blue?logo=webpack)
![TypeScript](https://img.shields.io/badge/TypeScript-Enabled-3178C6?logo=typescript)
![Less](https://img.shields.io/badge/Less-Styling-1D365D?logo=less)
![Pug](https://img.shields.io/badge/Pug-Template-A86454?logo=pug)
![Architecture](https://img.shields.io/badge/Architecture-SPA-111827)
![License](https://img.shields.io/badge/license-ISC-green)

Production-ready **Single Page Application** powered by **Webpack 5**.

This template provides a clean architecture with a minimal runtime layer, page-based routing, modular styling and Pug
templating.

---

## 🚀 Getting Started

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Build production bundle:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

## 📦 Project Structure

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
    main.less

  types/
```

### app/

Application bootstrap and router configuration.

```text
app.ts      → application bootstrap
routes.ts   → SPA routes definition
app.pug     → main application shell
```

The SPA mounts into:

```html
#app-root
```

### pages/

Page components used by the router.

Example:

```text
pages/
  home/
    home.page.ts
    home.pug
    style.less
```

Each page:

- Pages extend `BaseComponent` from `@razerspine/runtime`
- renders its own template
- loads its own styles

### shared/

Reusable layout components and mixins.

```text
shared/
  layout/
  mixins/
```

Includes:

- layout shells
- reusable Pug mixins
- structural UI blocks

### assets/

Static project resources.

```text
assets/
  i18n/
  icons/
  images/
```

Includes:

- translation files
- SVG icons
- images
- favicons

### styles/

Global style entry.

```text
styles/main.less
```

Example:

```less
@import '@razerspine/ui/less/ui';
```

---

## 🧭 Routing

Routing is configured in:

```text
src/app/routes.ts
```

Example:

```ts
import {HomePage} from '@pages/home/home.page';
import {NotFoundPage} from '@pages/not-found/not-found.page';
import {Route} from '@razerspine/runtime';

export const routes: Route[] = [
  {
    path: '/',
    component: HomePage,
    title: 'Razerspine SPA Template',
  },
  {
    path: '/404',
    component: NotFoundPage,
    title: 'Page Not Found',
  },
];
```

Router mounts components inside:

```text
#app-root
```

---

## 🧩 Component Model

This application uses a lightweight **component architecture** powered by `BaseComponent`.

Pages and UI blocks extend this class to gain:

- reactive state
- automatic DOM updates
- lifecycle hooks
- event delegation
- two-way form binding

### Example Page Component

```ts
import {BaseComponent} from '@razerspine/runtime';
import template from './home.pug';

interface HomeState {
  title: string;
  count: number;
}

export class HomePage extends BaseComponent<HomeState> {

  constructor(container: HTMLElement) {
    super(container, {
      title: 'Razerspine SPA Template',
      count: 0
    });
  }

  render() {
    this.container.innerHTML = template();
  }

  increment() {
    this.setState({
      count: this.state.count + 1
    });
  }

}
```

---

## 🔄 Reactive View Engine

The internal View Engine automatically synchronizes **state ↔ DOM**.

When `setState()` is called:

```ts
this.setState({
  count: this.state.count + 1
});
```

the DOM updates automatically.

No manual rendering required.

### Supported Data Attributes

| Attribute    | Description                                   | Example                             |
|--------------|-----------------------------------------------|-------------------------------------|
| `data-bind`  | Updates `textContent`                         | `span(data-bind="user.name")`       |
| `data-model` | Two-way binding (state ↔ input.value)         | `input(data-model="email")`         |
| `data-click` | Event delegation for clicks                   | `button(data-click="submit")`       |
| `data-show`  | Toggles visibility (supports !)               | `div(data-show="!isError")`         |
| `data-class` | Toggles CSS classes                           | `div(data-class="active:isActive")` |
| `data-for`   | Renders lists (supports nesting and `_index`) | `ul(data-for="item:items")`         |

Example:

```pug
button(data-click="increment") Add
span(data-bind="count")
```

---

## 🔁 Component Lifecycle

Each component follows this lifecycle:

```text
render()
↓
initEventListeners()
↓
update()
↓
onInit()
```

Lifecycle is automatically handled by the router.

Optional hooks:

```text
protected onInit()
protected onDestroy()
```

---

## ⚙ Runtime Services

This application uses lightweight runtime utilities from:

```text
@razerspine/runtime
```

Included services:

- `ConsoleLogger`
- `ThemeService`
- `TranslationService`
- `ApiService`

These services are provided during application bootstrap.

Example:

```ts
bootstrapApplication({
  providers: [
    provideRouter(routes),
    {provide: ThemeService, useValue: new ThemeService()},
    {provide: ConsoleLogger, useValue: new ConsoleLogger()}
  ]
});
```

---

## 🔗 Path Aliases

Webpack aliases are preconfigured:

```text
@app
@pages
@shared
@styles
@images
@icons
```

Example usage:

```ts
import {HomePage} from '@pages/home/home.page';
```

---

## 🏗 Architecture Principles

This application follows several key principles:

### Framework-agnostic

No framework lock-in.
You control the architecture.

### Clean SPA structure

Pages are isolated and loaded via router.

### Minimal runtime

CLI is only a project generator.
Generated apps contain no runtime dependency on the CLI.

### Modular UI

Uses:

```text
@razerspine/ui
```

for styling, layout utilities and design tokens.

---

## 🎨 UI System

This template integrates:

```text
@razerspine/ui
```

Features:

- light / dark themes
- design tokens
- layout utilities
- reusable mixins
- modular Less architecture

---

## 📄 License

ISC

---

Generated with **create**
