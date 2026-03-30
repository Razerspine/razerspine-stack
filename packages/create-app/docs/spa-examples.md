# SPA Examples

This document demonstrates real usage patterns for SPA templates powered by:

- `bootstrapApplication`
- `Router`
- `BaseComponent`
- Dependency Injection
- Proxy-based reactivity

All runtime features are provided by `@razerspine/runtime`.

---

## Minimal SPA Setup

### routes.ts

```ts
import {Route} from '@razerspine/runtime';
import {HomePage} from '@pages/home/home';

export const routes: Route[] = [
  { path: '/', component: HomePage }
];
```

### app.ts

```ts
import {bootstrapApplication, provideRouter} from '@razerspine/runtime';
import {routes} from './routes';

bootstrapApplication({
  providers: [
    provideRouter(routes)
  ]
});
```

The runtime will:

- initialize dependency injection
- configure the Router
- mount the application

---

## Basic Component

```ts
import {BaseComponent} from '@razerspine/runtime';
import template from './home.pug';

interface State {
  title: string;
  count: number;
}

export class HomePage extends BaseComponent<State> {

  constructor(container: HTMLElement) {
    super(container, {
      title: 'Hello SPA',
      count: 0
    });
  }

  protected render() {
    this.container.innerHTML = template();
  }

  increment() {
    this.setState({ count: this.state.count + 1 });
  }

  protected onInit() {
    console.log('Home mounted');
  }
}
```

---

## Dependency Injection Example

```ts
import {inject,  ConsoleLogger} from '@razerspine/runtime';

export class HomePage extends BaseComponent<State> {

  private logger = inject(ConsoleLogger);

  protected onInit() {
    this.logger.success('Home Page initialized!');
  }

}
```

---

## Router Guards

Route guards allow conditional navigation.

```ts
const routes: Route[] = [
  { path: '/', component: HomePage },
  { path: '/dashboard', component: DashboardPage, canActivate: [authGuard] }
];
```

Guard implementation:

```ts
const authGuard: CanActivateFn = () => {
  const isLoggedIn = checkAuth();
  return isLoggedIn ? true : '/login';
};
```

Guard return values:

| Return    | Behavior         |
|-----------|------------------|
| `true`    | allow navigation |
| `false`   | block navigation |
| `string`  | redirect         |
| `Promise` | async guard      |

---

## Declarative Navigation

```pug
a(data-link href="/dashboard") Dashboard
```

---

## Lifecycle

```text
Route change
  ↓
destroy previous component
  ↓
mount new component
  ↓
render()
  ↓
bind events
  ↓
applyBindings()
  ↓
onInit()
```

All cleanup is handled automatically.
