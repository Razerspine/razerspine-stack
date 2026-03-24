# Form Input Mixin (`+formInput`)

Renders a configurable `<input>` element paired with an optional `<label>`. This mixin simplifies form creation by
handling ID association, base styling, and reactive data binding out of the box.

---

## Parameters

| Parameter         | Type             | Default    | Description                                                                 |
|-------------------|------------------|------------|-----------------------------------------------------------------------------|
| **`type`**        | `String`         | *required* | Input type attribute (e.g., `text`, `email`, `password`, `number`).         |
| **`id`**          | `String`         | *required* | Unique identifier for the input. Also used for the label's `for` attribute. |
| **`label`**       | `String \| null` | `null`     | Visible label text. If `null` or empty, the `<label>` element is omitted.   |
| **`placeholder`** | `String`         | `''`       | Ghost text displayed inside the input when it is empty.                     |
| **`name`**        | `String`         | `''`       | The `name` attribute used for form submission.                              |
| **`value`**       | `String`         | `''`       | Initial value for the input field.                                          |
| **`attrs`**       | `Object \| null` | `{}`       | Additional HTML attributes (e.g., `{ required: true, min: 0 }`).            |
| **`bindings`**    | `Object \| null` | `{}`       | Reactive bindings for `@razerspine/runtime`.                                |

---

## Behavior & Features

### Reactive Bindings

The mixin integrates with the `@razerspine/runtime` system via the `_mapRuntimeBindings` helper. This is most commonly
used for two-way data binding:

- `model` ➔ `data-model` (links the input value to a data property)
- `show` ➔ `data-show`
- `bind` ➔ `data-bind`

### Styling & Structure

- **Base Class:** Automatically applies the `.form-control` class to the input.
- **Class Merging:** If you provide a `class` inside the `attrs` object, it will be safely merged with the default
  `.form-control`.
- **Label Association:** The mixin strictly enforces accessibility by linking the `<label for="...">` to the
  `<input id="...">` using the provided `id`.

---

## Accessibility (A11y)

- If a `label` is provided, the input is automatically accessible to screen readers.
- If no `label` is provided, ensure you pass an `aria-label` via the `attrs` parameter to maintain accessibility
  standards.

---

## Examples

### 1. Text Input with Two-Way Binding

A standard username field linked to a reactive user object.

```pug
+formInput(
  'text', 
  'user-name', 
  'Username', 
  'Enter your name', 
  'username', 
  '', 
  {}, 
  { model: 'user.name' }
)
```

### 2. Required Password Field

```pug
+formInput(
  'password', 
  'user-pass', 
  'Password', 
  'Min. 8 characters', 
  'password', 
  '', 
  { required: true, minlength: 8 }
)
```

### 3. Number Input with Custom Attributes

```pug
+formInput(
  'number', 
  'item-qty', 
  'Quantity', 
  '0', 
  'quantity', 
  '1', 
  { min: 1, max: 99, class: 'input--compact' }
)
```
