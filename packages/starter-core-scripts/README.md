# @razerspine/starter-core-scripts

[![npm version](https://img.shields.io/npm/v/@razerspine/starter-core-scripts.svg)](https://www.npmjs.com/package/@razerspine/starter-core-scripts)
[![changelog](https://img.shields.io/badge/docs-changelog-blue.svg)](./CHANGELOG.md)
[![license](https://img.shields.io/npm/l/@razerspine/starter-core-scripts.svg)](./LICENSE)

Core frontend services and reactive View Engine used by official webpack starter templates.

This package provides production-ready utilities for:

- **Reactive View Engine**: Lightweight data-binding and state management.
- **SPA Router**: Client-side navigation with automated lifecycle management.
- **Theme Management**: Light/dark mode with persistence.
- **Internationalization**: DOM-based i18n support.
- **API Requests**: Structured Fetch wrapper.
- **Logging**: Styled console utilities.

---

## Installation

```bash
npm install @razerspine/starter-core-scripts
```

---

## 🚀 Reactive View Engine (New in v0.4.0)

A lightweight, dependency-free mechanism to sync your JavaScript state with the DOM and manage SPA navigation.

### BaseComponent & Lifecycle

Extend `BaseComponent` to create reactive pages. In **v0.4.0**, we introduced an automated lifecycle. You no longer need
to
manually call update or event binders.

- `mount()`: Orchestrates the entire startup (`render` -> `bind events` -> `sync state` -> `onInit`).
- `onInit()`: Your hook for API calls or setup logic.
- `onDestroy()`: Cleanup hook for timers or subscriptions.

### Example: Logic (home.ts)

```ts
import {BaseComponent} from '@razerspine/starter-core-scripts';
import template from './home.pug';

interface HomeState {
  title: string;
  count: number;
}

export class HomePage extends BaseComponent<HomeState> {
  constructor(container: HTMLElement) {
    super(container, {title: 'SPA Template', count: 0});
  }

  // Mandatory: Only responsible for injecting HTML
  protected render() {
    this.container.innerHTML = template();
  }

  // Optional: Called automatically after mounting
  protected onInit() {
    console.log('Component is live!');
  }

  increment() {
    this.setState({count: this.state.count + 1});
  }
}
```

### 🗺️ SPA Routing

The built-in `Router` handles navigation and automatically manages component lifecycles. Thanks to the **Singleton
pattern**, you can navigate from anywhere in your app without holding a reference to the router instance.

#### Initialization (app.ts)

```ts
import {Router, Route} from '@razerspine/starter-core-scripts';
import {HomePage} from './views/pages/home';

const routes: Route[] = [
  {path: '/', component: HomePage, title: 'Home'}
];

// Initialize once at the entry point
new Router(routes, 'app-root');
```

### Programmatic Navigation (Inside any component)

```ts
import {Router} from '@razerspine/starter-core-scripts';

export class LoginPage extends BaseComponent<any> {
  // ...
  onLoginSuccess() {
    // Accessible globally via static method
    Router.navigate('/dashboard');
  }
}
```

### Supported Data Attributes

| Attribute    | Description                                   | Example                             |
|--------------|-----------------------------------------------|-------------------------------------|
| `data-bind`  | Updates `textContent`                         | `span(data-bind="user.name")`       |
| `data-model` | Two-way binding (state ↔ input.value)         | `input(data-model="email")`         |
| `data-click` | Event delegation for clicks                   | `button(data-click="submit")`       |
| `data-show`  | Toggles visibility (supports !)               | `div(data-show="!isError")`         |
| `data-class` | Toggles CSS classes                           | `div(data-class="active:isActive")` |
| `data-for`   | Renders lists (supports nesting and `_index)` | `ul(data-for="item:items")`         |

### ⚙️ Technical Notes (v0.4.0 Updates)

- **Singleton Router**: The `Router` class stores its instance internally. Use `Router.navigate(path)` for programmatic
  redirects.
- **Smart Rendering**: The `Router` detects if a component has a `mount()` method (`BaseComponent`) or a simple
  `render()`.
- **Memory Management**: `BaseComponent` includes a `cleanupCallbacks` registry to prevent memory leaks.
- **Reactivity**: Powered by Proxies with `WeakMap` caching for performance.
- **Store Disconnect**: `createStore` now returns `{state, disconnect}`. BaseComponent handles this automatically.
- **Direct Bindings**: `data-for` uses scope guarding to prevent nested loops from conflicting with parent state.

---

## Exports (example)

```ts
import {
  BaseComponent,
  ThemeService,
  TranslationService,
  ApiService,
  ApiError,
  ConsoleLogger
} from '@razerspine/starter-core-scripts';
```

---

## ThemeService

Manages light/dark theme state with optional localStorage persistence.

```ts
const theme = new ThemeService();
theme.init();
theme.setTheme('dark');
```

---

## TranslationService

Provides DOM-based i18n support using `data-i18n` attributes.

```ts
const locales = {
  en: {greeting: {hello: 'Hello'}},
  uk: {greeting: {hello: 'Привіт'}}
};

const i18n = new TranslationService(locales);
i18n.init();
```

---

## ApiService

**Lightweight Fetch wrapper with**:

- Query params support
- Timeout via AbortController
- Automatic JSON handling
- Centralized error handling
- Optional Bearer token

```ts
const api = new ApiService('https://api.example.com');
api.setToken('jwt-token');

try {
  const users = await api.get('/users', {
    params: {role: 'admin'},
    timeout: 5000
  });
} catch (err) {
  if (err instanceof ApiError) {
    console.error(err.status, err.data);
  }
}
```

---

## ConsoleLogger

Styled console logging utility.

```ts
const logger = new ConsoleLogger();
logger.success('Application initialized');
```

---

## Features

- **Zero Dependencies**: Pure Vanilla JS/TS logic.
- **Reactive**: Powered by JavaScript Proxies.
- **Hybrid Ready**: Works perfectly for both SPA and MPA.
- **Full TypeScript**: Strong typing for your state and components.

---

## Requirements

- **Modern Browsers**: ES6+ (Proxy, WeakMap, Fetch support required).
- TypeScript: 5.0+ recommended.

---

## License

This project is licensed under the ISC License.
