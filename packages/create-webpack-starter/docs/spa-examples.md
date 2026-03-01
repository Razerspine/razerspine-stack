# SPA Examples (starter-core-scripts v0.4.0)

This document demonstrates real usage patterns for SPA templates powered by:

- `Router`
- `BaseComponent`
- Proxy-based reactivity
- Automated lifecycle (`mount()`)

---

## Minimal SPA Setup

### routes.ts

```ts
import {Route} from '@razerspine/starter-core-scripts';
import {HomePage} from '@views/pages/home/home';

export const routes: Route[] = [
  { path: '/', component: HomePage, title: 'Home' }
];
```

### app.ts

```ts
import {Router} from '@razerspine/starter-core-scripts';
import {routes} from './routes';

document.addEventListener('DOMContentLoaded', () => {
  new Router(routes);
});
```

**Router will**:

- Handle navigation
- Destroy previous components
- Automatically call `mount()` on new pages

---

## Basic Reactive Page

### home.pug

```pug
section
  h1(data-bind="title")

  input(type="text" data-model="title")

  button(data-click="increment") +
  p Count: 
    span(data-bind="count")

  button(data-link href="/about") Go to About
```

### home.ts

```ts
import {BaseComponent} from '@razerspine/starter-core-scripts';
import template from './home.pug';

interface HomeState {
  title: string;
  count: number;
}

export class HomePage extends BaseComponent<HomeState> {

  constructor(container: HTMLElement) {
    super(container, {
      title: 'Hello SPA',
      count: 0
    });
  }

  protected render(): void {
    this.container.innerHTML = template();
  }

  increment(): void {
    this.setState({ count: this.state.count + 1 });
  }

  protected onInit(): void {
    console.log('Home mounted');
  }

  protected onDestroy(): void {
    console.log('Home destroyed');
  }
}
```

**No need to call**:

- `update()`
- `initEventListeners()`
- `mount()` handles everything automatically.

---

## Programmatic Navigation

**Because Router is a Singleton**:

```ts
import {Router} from '@razerspine/starter-core-scripts';

Router.navigate('/dashboard');
```

No need to pass router instances.

---

## List Rendering (`data-for`)

### template

```pug
ul(data-for="item:items")
  li
    span(data-bind="item.name")
    span(data-bind="item_index")
```

### component

```text
interface State {
  items: { name: string }[];
}

super(container, {
  items: [
    { name: 'First' },
    { name: 'Second' }
  ]
});
```
> ⚠ Note: data-for performs full re-rendering (no diffing).

---

## Conditional Rendering

```pug
div(data-show="isVisible") Visible block
div(data-class="active:isActive") Toggle class
```

State change automatically reflect in DOM.

---

## Memory Safety

**On route change**:

```text
destroy()
  → onDestroy()
  → cleanupCallbacks()
  → Proxy disconnect()
  → container cleared
```

Event listeners and store are automatically cleaned.

---

## SPA Lifecycle Overview

```text
Route change
  ↓
destroy previous page
  ↓
new Page(root)
  ↓
mount()
  ↓
render()
  ↓
bind events
  ↓
applyBindings()
  ↓
onInit()
```
