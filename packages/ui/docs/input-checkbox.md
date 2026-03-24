# Checkbox Mixin (`+inputCheckbox`)

Renders a configurable checkbox input paired with a label. This mixin automates the association between the input and
its label while providing a consistent layout structure and support for reactive data binding.

---

## Parameters

| Parameter      | Type      | Default    | Description                                                                 |
|----------------|-----------|------------|-----------------------------------------------------------------------------|
| **`id`**       | `String`  | *required* | Unique identifier for the input. Also used for the label's `for` attribute. |
| **`label`**    | `String`  | *required* | Visible text shown next to the checkbox.                                    |
| **`name`**     | `String`  | `''`       | The `name` attribute used for form submission or grouping.                  |
| **`value`**    | `String`  | `'on'`     | The value submitted to the server when the checkbox is checked.             |
| **`checked`**  | `Boolean` | `false`    | Whether the checkbox is initially in a checked state.                       |
| **`attrs`**    | `Object`  | `{}`       | Additional HTML attributes for the `<input>` (e.g., `{ disabled: true }`).  |
| **`bindings`** | `Object`  | `{}`       | Reactive bindings for `@razerspine/runtime`.                                |

---

## Behavior & Features

### Structure & Styling

- **Wrapper:** The input and label text are wrapped together in an inline control container with the
  `.check-control-label` class.
- **Base Class:** The checkbox itself receives the `.input-base` class.
- **Class Merging:** Any `class` provided inside the `attrs` object is automatically merged with the base `.input-base`
  class.

### Reactive Bindings

The mixin utilizes the `_mapRuntimeBindings` helper to map keys in the `bindings` object to `data-*` attributes:

- `model` ➔ `data-model` (links the checked state to a data property)
- `click` ➔ `data-click`
- `show` ➔ `data-show`

---

## Accessibility (A11y)

The mixin ensures a proper accessibility tree by strictly linking the `<label for="...">` to the `<input id="...">`.
This allows screen readers to correctly identify the purpose of the checkbox and enables users to toggle the checkbox by
clicking the label text.

---

## Examples

### 1. Basic Checkbox with Model Binding

A standard "Terms of Service" agreement checkbox linked to a reactive form model.

```pug
+inputCheckbox(
  'agree', 
  'I agree to the terms', 
  'terms', 
  'yes', 
  false, 
  {}, 
  { model: 'form.agreed' }
)
```

### 2. Disabled Pre-checked State

A subscription checkbox that is checked by default but currently disabled.

```pug
+inputCheckbox(
  'newsletter', 
  'Subscribe to newsletter', 
  'news', 
  '1', 
  true, 
  { disabled: true }
)
```

### 3. Checkbox with Reactive Click Handler

```pug
+inputCheckbox(
  'toggle-debug', 
  'Enable Debug Mode', 
  'debug', 
  'on', 
  false, 
  { class: 'input--warning' }, 
  { click: 'onDebugToggle' }
)
```
