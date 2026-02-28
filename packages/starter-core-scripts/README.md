# @razerspine/starter-core-scripts

[![npm version](https://img.shields.io/npm/v/@razerspine/starter-core-scripts.svg)](https://www.npmjs.com/package/@razerspine/starter-core-scripts)
[![changelog](https://img.shields.io/badge/docs-changelog-blue.svg)](./CHANGELOG.md)
[![license](https://img.shields.io/npm/l/@razerspine/starter-core-scripts.svg)](./LICENSE)

Core frontend services and reactive View Engine used by official webpack starter templates.

This package provides production-ready utilities for:

- **Reactive View Engine**: Lightweight data-binding and state management.
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

A lightweight, dependency-free mechanism to sync your JavaScript state with the DOM using `data-` attributes.

### BaseComponent & Store

Extend `BaseComponent` to create reactive pages or components. The state is managed via JavaScript Proxies, meaning the
DOM updates automatically when you modify `this.state`.

- Define your Template (`home.pug`)

```pug
section.section
  h1(data-bind="title")
  
  .controls
    input(type="text" data-model="title" placeholder="Type to sync...")
    button(data-click="updateTitle") Reset Title
  
  p.loader(data-show="isLoading") Processing...
  div(data-class="status--success:isDone") Task Complete
```

- Create your Logic (`home.ts`)

```ts
import {BaseComponent} from '@razerspine/starter-core-scripts';
import template from './home.pug';

interface HomeState {
  title: string;
  isLoading: boolean;
  isDone: boolean;
}

export class HomePage extends BaseComponent<HomeState> {
  constructor(container: HTMLElement) {
    super(container, { 
      title: 'Hello Webpack!', 
      isLoading: false,
      isDone: false 
    });
  }

  render() {
    // 1. Inject Pug template
    this.container.innerHTML = template();
    
    // 2. Initialize reactive bindings and event listeners
    this.initEventListeners();
    this.update(); 
  }

  updateTitle() {
    this.state.title = 'Title Reset!'; // UI updates automatically
  }
}
```

### Supported Data Attributes


| Attribute    | Description                     | Example                             |
|--------------|---------------------------------|-------------------------------------|
| `data-bind`  | Updates `textContent`           | `span(data-bind="user.name")`       |
| `data-model` | Two-way binding for inputs      | `input(data-model="email")`         |
| `data-click` | Event delegation for clicks     | `button(data-click="submit")`       |
| `data-show`  | Toggles visibility (supports !) | `div(data-show="!isError")`         |
| `data-class` | Toggles CSS classes             | `div(data-class="active:isActive")` |


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

- Modern browser (Fetch API support)
- TypeScript 5+
- Bundler environment recommended

---

## License

This project is licensed under the ISC License.
