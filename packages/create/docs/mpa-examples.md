# MPA Examples

MPA templates use the same reactive engine as SPA, but without Router and BaseComponent.

**MPA templates can use**:

- `createStore`
- `applyBindings`
- `bindClickEvents`
- `bindForms`
- Proxy-based deep reactivity
- Manual lifecycle management

There is **no Router**, and no automatic lifecycle orchestration.

Each page is independent and initialized via `DOMContentLoaded`.

---

## Minimal Reactive MPA Page

### home.ts

```ts
import {
  createStore,
  applyBindings,
  bindClickEvents,
  bindForms
} from '@razerspine/runtime';

interface HomeState {
  title: string;
  count: number;
}

export class HomePage {
  private state: HomeState;
  private cleanupCallbacks: Array<() => void> = [];

  constructor() {
    const {state, disconnect} = createStore<HomeState>(
      {
        title: 'Hello MPA',
        count: 0
      },
      () => this.update()
    );

    this.state = state;

    // register store cleanup
    this.cleanupCallbacks.push(disconnect);

    this.init();
  }

  private init(): void {
    this.update();

    // enable data-click
    this.cleanupCallbacks.push(
      bindClickEvents(document.body, this)
    );

    // enable data-model (two-way binding)
    this.cleanupCallbacks.push(
      bindForms(document.body, this, this.state)
    );
  }

  private update(): void {
    applyBindings(document.body, this.state);
  }

  increment(): void {
    this.state.count++;
  }

  destroy(): void {
    this.cleanupCallbacks.forEach(cb => cb());
    this.cleanupCallbacks = [];
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new HomePage();
});
```

---

## Template Example

```pug
section
  h1(data-bind="title")

  input(type="text" data-model="title")

  button(data-click="increment") +
  p
    span(data-bind="count")
```

---

## What Happens Internally

```text
createStore()
  → Proxy wraps state
  → onChange triggers update()

bindClickEvents()
  → Delegated click handler
  → Calls context method

bindForms()
  → Delegated input listener
  → setValue(state, path)
  → Proxy triggers update()

applyBindings()
  → Syncs state → DOM
```

---

## MPA vs SPA (Technical Difference)

|  Feature            | SPA       | MPA    |
|---------------------|-----------|--------|
| `Router`            | ✅        | ❌     |
| `BaseComponent`     | ✅        | ❌     |
| `mount()` lifecycle | ✅        | ❌     |
| `createStore`       | Internal  | Manual |
| `bindClickEvents`   | Internal  | Manual |
| `bindForms`         | Internal  | Manual |
| Memory cleanup      | Automatic | Manual |

---

## Important Note

**In MPA**:

- You are responsible for:
  - Calling `applyBindings`
  - Binding events
  - Cleaning up listeners if needed
- No automatic `destroy()` is triggered by navigation
- Each page reload resets state
