# Runtime Engine

`@razerspine/runtime` is a **lightweight frontend runtime engine** designed for building **SPA and hybrid applications**
without heavy frameworks.

It provides a structured **application architecture** while keeping full control over the DOM and build system.

---

## Philosophy

The runtime is built around a few core ideas:

- **No framework lock-in**
- **Explicit architecture**
- **Deterministic lifecycle**
- **Reactive without Virtual DOM**
- **Minimal abstraction over the platform**

---

## What It Is (and What It Isn’t)

### ✅ It is:

- A runtime layer for UI logic
- A structured alternative to frameworks
- A tool for building real applications
- A composition of small focused systems

### ❌ It is NOT:

- A full framework (like React / Angular / Vue)
- A meta-framework (like Next.js / Nuxt)
- A zero-config magic tool

---

## Core Capabilities

The runtime provides:

- Dependency Injection (strict mode)
- SPA Router with lifecycle control
- Reactive state (Proxy-based)
- Component system
- DOM binding engine
- Route guards
- Platform services (theme, i18n)
- HTTP abstraction layer

All with **zero external dependencies**.

---

## Architecture Overview

```text
runtime
-> core         (DI container)
-> router       (navigation engine)
-> reactivity   (state system)
-> view         (components + bindings)
-> http         (API layer)
-> platform     (theme + i18n)
-> utils
```


Each module is **independent but composable**.

---

## Application Model

Applications are built around:

- **Bootstrap**
- **Router**
- **Components**
- **Reactive state**

---

## Bootstrap

Every application starts with:

```ts
bootstrapApplication({
  providers: [
      provideRouter(routes)
  ]
});
```

### Responsibilities

- Create DI container
- Register services
- Initialize Router
- Wait for DOM readiness
- Start application lifecycle

---

## Component System

Components extend `BaseComponent`.

```ts
export class HomePage extends BaseComponent {
    protected render() {
        this.container.innerHTML = `<h1>Hello</h1>`;
    }
}
```

### Key Principles

- Components control their own DOM
- No Virtual DOM
- Rendering is explicit
- Updates are reactive

---

## Reactive System

State is implemented via **Proxy-based** reactivity.

```ts
this.setState({
    count: this.state.count + 1
});
```

### Characteristics

- Deep reactivity
- No diffing
- Direct DOM updates
- Predictable performance

---

## View Engine (Bindings)

The runtime uses **declarative DOM bindings**:

```html
<span data-bind="title"></span>
<input data-model="email" />
<button data-click="submit"></button>
```

### Supported bindings:

- `data-bind`
- `data-model`
- `data-click`
- `data-show`
- `data-class`
- `data-for`

Bindings are processed via a **modular processor engine**.

---

## Router

The Router is a **central orchestrator**.

```ts
provideRouter([
    { path: '/', component: HomePage }
]);
```

### Responsibilities

- URL matching
- Navigation
- Component lifecycle
- History management

---

## Lifecycle

### Component lifecycle is deterministic:

```text
render()
 ↓
initEventListeners()
 ↓
update()
 ↓
onInit()
```

### On navigation:

```text
destroy previous
 ↓
create new component
 ↓
mount()
 ↓
full lifecycle
```

---

## Route Guards

Guards control navigation:

```ts
const authGuard = () => {
    return isLoggedIn() ? true : '/login';
};
```

### Supported results:

- `true` → allow
- `false` → block
- `string` → redirect
- `Promise` → async

---

## Dependency Injection

Strict DI container:

```ts
const router = inject(Router);
```

### Rules

- No auto-registration
- Explicit providers only
- Fail-fast on missing dependencies

---

## Platform Services

### ThemeService

- light / dark mode
- persistence
- DOM integration

### TranslationService
- DOM-based i18n
- nested keys
- runtime switching

### HTTP Layer

`ApiService` provides:

- Fetch wrapper
- JSON handling
- timeout support
- auth token support
- structured errors

---

## Why No Virtual DOM?

The runtime avoids Virtual DOM to:

- reduce complexity
- eliminate diffing overhead
- keep behavior predictable
- leverage native DOM performance

---

## SPA vs MPA Usage

### SPA

- Full runtime usage
- Router enabled
- Component lifecycle active

### MPA

- Partial runtime usage
- No Router
- Manual initialization

---

## When to Use This Runtime

Best suited for:

- dashboards
- admin panels
- CMS-driven apps
- hybrid SPA/MPA systems
- template-driven architectures

---

## When NOT to Use It

Avoid if you need:

- large ecosystem (React/Vue plugins)
- SSR frameworks
- heavy UI abstraction

---

## Relationship to Other Packages

Used together with:

- `@razerspine/build` → build system
- `@razerspine/ui` → UI components
- `@razerspine/create` → project scaffolding

---

## Mental Model

Think of the runtime as:

> “A structured layer over the browser, not a replacement for it.”

---

## Summary

`@razerspine/runtime` gives you:

- structure without rigidity
- power without complexity
- control without boilerplate

It is designed for developers who want to:

- understand their architecture
- control their runtime
- avoid framework overhead
