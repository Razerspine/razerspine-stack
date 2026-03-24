# Radio Mixin (`+inputRadio`)

Renders a configurable radio input element with an associated label. This mixin is specifically designed to work within
reactive radio groups, where multiple inputs share the same name and data model.

---

## Parameters

| Parameter      | Type      | Default    | Description                                                                      |
|----------------|-----------|------------|----------------------------------------------------------------------------------|
| **`id`**       | `String`  | *required* | Unique identifier for the input. Also used for the label's `for` attribute.      |
| **`label`**    | `String`  | *required* | Visible label text shown next to the radio button.                               |
| **`name`**     | `String`  | *required* | The `name` attribute used to group multiple radio buttons together.              |
| **`value`**    | `String`  | *required* | The value submitted or stored in the model when this specific radio is selected. |
| **`checked`**  | `Boolean` | `false`    | Whether this radio button is selected by default.                                |
| **`attrs`**    | `Object`  | `{}`       | Additional HTML attributes for the `<input>` (e.g., `{ disabled: true }`).       |
| **`bindings`** | `Object`  | `{}`       | Reactive bindings for `@razerspine/runtime`.                                     |

---

## Behavior & Features

### Radio Groups

To create a functional radio group where only one option can be selected at a time:

1. All `+inputRadio` instances in the group **must** share the same `name` attribute.
2. For reactive behavior, all instances in the group should share the same `bindings.model` key.

### Structure & Styling

- **Wrapper:** Like the checkbox mixin, this wraps the input and label in a `.check-control-label` inline container.
- **Base Class:** The radio input receives the `.input-base` class by default.
- **Class Merging:** Custom classes provided in the `attrs` object are automatically merged with the base styling.

### Reactive Bindings

Uses the `_mapRuntimeBindings` helper to link the radio state to the application data:

- `model` ➔ `data-model` (The group's shared data property)
- `click` ➔ `data-click`
- `show` ➔ `data-show`

---

## Accessibility (A11y)

- **Labeling:** The mixin ensures the `<label>` is correctly linked to the radio via `id`, allowing users to select the
  option by clicking the text.
- **Grouping:** Using the same `name` attribute across a group of radios is essential for screen readers to understand
  that the options are mutually exclusive.

---

## Examples

### 1. Reactive Radio Group

Multiple radio buttons bound to a single reactive property (`user.gender`).

```pug
.input-group
  +inputRadio('m', 'Male', 'gender', 'male', false, {}, { model: 'user.gender' })
  +inputRadio('f', 'Female', 'gender', 'female', false, {}, { model: 'user.gender' })
  +inputRadio('o', 'Other', 'gender', 'other', false, {}, { model: 'user.gender' })
```

### 2. Disabled Option

A radio button that is visible but cannot be interacted with.

```pug
+inputRadio(
  'opt-restricted', 
  'Premium Feature (Disabled)', 
  'plan', 
  'premium', 
  false, 
  { disabled: true }
)
```

### 3. Radio with Custom Attributes

```pug
+inputRadio(
  'contact-email', 
  'Email Notification', 
  'contact-method', 
  'email', 
  true, 
  { class: 'input--highlight' }
)
```
