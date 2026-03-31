# @razerspine/runtime

[![npm version](https://img.shields.io/npm/v/@razerspine/runtime.svg)](https://www.npmjs.com/package/@razerspine/runtime)
[![Vitest](https://img.shields.io/badge/Vitest-120_passed-success?logo=vitest)]()
[![changelog](https://img.shields.io/badge/docs-changelog-blue.svg)](./CHANGELOG.md)
[![license](https://img.shields.io/npm/l/@razerspine/runtime.svg)](./LICENSE)

Lightweight **frontend runtime engine** for building modern **SPA / Hybrid applications** without heavy frameworks.

The runtime provides a minimal but powerful foundation including:

- **Dependency Injection**
- **SPA Router**
- **Reactive View Engine**
- **Component Lifecycle**
- **Template Bindings**
- **Platform Services**
- **HTTP Utilities**

**Zero runtime dependencies.**

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Application Bootstrap](#application-bootstrap)
- [Runtime Architecture](#runtime-architecture)
- [Dependency Injection](#dependency-injection)
- [Reactive View Engine](#reactive-view-engine)
- [Component Lifecycle](#component-lifecycle)
- [SPA Router](#spa-router)
- [Route Guards](#route-guards)
- [Programmatic Navigation](#programmatic-navigation)
- [Supported Data Attributes](#supported-data-attributes)
- [ThemeService](#themeservice)
- [TranslationService](#translationservice)
- [ApiService](#apiservice)
- [ConsoleLogger](#consolelogger)
- [Exports](#exports)
- [Requirements](#requirements)
- [License](#license)

---

## Features

- **Reactive View Engine** — lightweight DOM binding system
- **Dependency Injection** — strict-mode DI container
- **SPA Router** — client-side navigation engine
- **Route Guards** — navigation protection and redirects
- **Component Lifecycle** — deterministic initialization and cleanup
- **Template Bindings** — declarative DOM updates
- **Reactive State** — Proxy-based store
- **HTTP Utilities** — structured Fetch wrapper
- **Theme Management** — light/dark mode with persistence
- **Internationalization** — DOM-based i18n system
- **Logging Utilities**
- **Zero Dependencies**

---

## Installation

```bash
npm install @razerspine/runtime
```

---

## Quick Start

Create a minimal SPA with Router.

```ts
import {
  bootstrapApplication,
  provideRouter
} from '@razerspine/runtime';

import {HomePage} from './views/home';

bootstrapApplication({
  providers: [
    provideRouter([
      {path: '/', component: HomePage, title: 'Home'}
    ])
  ]
});
```

Bootstrap will:

1. Initialize the DI container
2. Register the Router
3. Mount the first page

---

## Application Bootstrap

Applications start with: `bootstrapApplication()`

Example:

```ts
bootstrapApplication({
  rootId: 'app-root',
  providers: [
    provideRouter([
      {path: '/', component: HomePage}
    ])
  ]
});
```

**Bootstrap responsibilities**:

- Initialize DI container
- Register providers
- Resolve routes
- Wait for DOM readiness
- Start the Router

This makes application startup deterministic and safe.

---

## Runtime Architecture

Version 1.0.0 introduces a modular runtime architecture. The codebase is organized into clearly separated modules.

```text
src/
├── core
├── router
├── reactivity
├── view
├── http
├── platform
└── utils
```

---

## Module Overview

### core

Dependency Injection container.

- **Responsibilities**: service registration, dependency resolution, injection helper.

### router

SPA navigation engine.

- **Features**: route matching, async navigation, route guards, safe component rendering.

### reactivity

Proxy-based reactive store via `createStore()`.

- **Features**: deep observation, nested proxy caching, stable references, manual cleanup.

### view

Component system and DOM rendering engine.

- **Contains**: `BaseComponent`, bindings engine, bootstrap system.
- Bindings are implemented using processor-based architecture.

```text
bindings/
└── engine/
└── processors/
```

**Processors**: `bind`, `class`, `for`, `model`, `show`.

### http

HTTP utilities. Includes `ApiService` and `ApiError`.

### platform

Platform-level services. Includes `ThemeService` and `TranslationService`.

### utils

Shared runtime utilities (DOM helpers, console logging).

---

## Dependency Injection

The runtime includes a strict-mode DI container. Services must be registered during bootstrap.

### Injecting Services

```ts
import {inject, Router} from '@razerspine/runtime';

export class HomePage {
  private router = inject(Router);

  navigate() {
    this.router.navigate('/dashboard');
  }
}
```

### Providing Services

```ts
bootstrapApplication({
  providers: [
    {provide: ApiService},
    {provide: ConsoleLogger}
  ]
});
```

### Factory Providers

```ts
bootstrapApplication({
  providers: [
    {
      provide: ApiService,
      useFactory: () => new ApiService('/api')
    }
  ]
});
```

> **Strict DI Mode**: Services are not auto-instantiated. If a service is injected but not registered, the runtime will
> throw:
>
> `Service "MyService" is not registered in the DI container`.

---

## Reactive View Engine

Reactive components are built using `BaseComponent`. State changes automatically update the DOM.

### Example Component

```ts
import {BaseComponent} from '@razerspine/runtime';

interface HomeState {
  title: string
  count: number
}

export class HomePage extends BaseComponent<HomeState> {
  constructor(container: HTMLElement) {
    super(container, {
      title: 'Runtime Demo',
      count: 0
    });
  }

  protected render() {
    this.container.innerHTML = `
      <h1 data-bind="title"></h1>
      <button data-click="increment">+</button>
      <span data-bind="count"></span>
    `;
  }

  increment() {
    this.setState({
      count: this.state.count + 1
    });
  }
}
```

---

## Component Lifecycle

Lifecycle execution order:

`render()` → `initEventListeners()` → `update()` → `onInit()`

Lifecycle orchestration is handled by `mount()`. Router automatically calls `mount()` for page components.

### Async Lifecycle

Lifecycle hooks support async operations.

```text
protected async onInit() {
  const users = await api.get('/users');
  this.setState({ users });
}
```

### Supported signatures:

- `render(): void | Promise<void>`
- `onInit(): void | Promise<void>`

The Router waits for full initialization before completing navigation.

---

## SPA Router

Router manages client-side navigation, browser history, component lifecycle, and route guards.

### Route Configuration

```ts
import {Route} from '@razerspine/runtime';

const routes: Route[] = [
  {
    path: '/',
    component: HomePage,
    title: 'Home'
  }
];
```

### Route Guards

Routes can define canActivate guards.

**Guard results**:

- `true` — allow navigation
- `false` — block navigation
- `string` — redirect (e.g., `'/login'`)
- `Promise` — async guard

**Example**:

```text
const authGuard = () => {
  const token = localStorage.getItem('token');
  return token ? true : '/login';
};

// Usage in routes:
{
  path: '/dashboard',
  component: DashboardPage,
  canActivate: [authGuard]
}
```

### Programmatic Navigation

```ts
import {inject, Router} from '@razerspine/runtime';

export class LoginPage {
  private router = inject(Router);

  onLoginSuccess() {
    this.router.navigate('/dashboard');
  }
}
```

---

## Supported Data Attributes

| Attribute  | Description            | Example                             |
|------------|------------------------|-------------------------------------|
| data-bind  | Updates textContent    | `span(data-bind="user.name")`       |
| data-model | Two-way binding        | `input(data-model="email")`         |
| data-click | Event delegation       | `button(data-click="submit")`       |
| data-show  | Conditional visibility | `div(data-show="!isError")`         |
| data-class | Toggle CSS classes     | `div(data-class="active:isActive")` |
| data-for   | List rendering         | `ul(data-for="item:items")`         |

---

## ThemeService

Manages light/dark theme state.

```ts
const theme = new ThemeService();
theme.init();
theme.setTheme('dark');
```

---

## TranslationService

DOM-based i18n system.

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

Fetch wrapper with query params, timeout, automatic JSON handling, structured errors, and Bearer token support.

```ts
const api = new ApiService('[https://api.example.com](https://api.example.com)');
api.setToken('jwt');

const users = await api.get('/users');
```

---

## ConsoleLogger

Styled console logs.

```ts
const logger = new ConsoleLogger();
logger.success('Application started');
```

---

## Exports

```ts
import {
  BaseComponent,
  Router,
  bootstrapApplication,
  provideRouter,
  inject,
  ApiService,
  ApiError,
  ThemeService,
  TranslationService,
  ConsoleLogger
} from '@razerspine/runtime';
```

---

## Requirements

- **Node.js**: `^20.10.0` or higher (LTS recommended)
- **TypeScript**: `^5.0.0`
- **Browsers**: Modern evergreen browsers (Chrome, Firefox, Safari, Edge)

---

## License

ISC License
