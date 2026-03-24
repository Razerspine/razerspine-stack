# Form Input Mixin (`+formInput`)

Renders a configurable `<input>` element paired with an optional `<label>`. This mixin automates accessibility via ID linking, applies standard Bootstrap-like styling, and integrates with the reactive system.

---

## Parameters

| Parameter         | Type             | Default    | Description                                                                   |
|-------------------|------------------|------------|-------------------------------------------------------------------------------|
| **`type`**        | `String`         | *required* | Input type attribute (e.g., `text`, `email`, `password`, `number`).           |
| **`id`**          | `String`         | *required* | Unique identifier. Used for the input `id` and label `for` attribute.         |
| **`label`**       | `String \| null` | `null`     | Visible label text. If provided, triggers an automatic `data-i18n` attribute. |
| **`placeholder`** | `String`         | `''`       | Ghost text displayed inside the input.                                        |
| **`name`**        | `String`         | `''`       | The `name` attribute for form submission.                                     |
| **`value`**       | `String`         | `''`       | Initial value for the input field.                                            |
| **`attrs`**       | `Object`         | `{}`       | Additional HTML attributes (e.g., `{ required: true, min: 0 }`).              |
| **`bindings`**    | `Object`         | `{}`       | Reactive bindings for `@razerspine/runtime`.                                  |

---

## Behavior & Features

### Built-in Internationalization (i18n)

When a `label` is provided, the mixin automatically adds a `data-i18n` attribute to the `<label>` element. This ensures that form labels are ready for translation out of the box.

### Attribute Merging Strategy

The mixin merges attributes in a specific order of priority (from lowest to highest):
1. **Base Attributes:** `type`, `id`, `name`, `value`, `placeholder`.
2. **Custom Attributes:** Anything passed through the `attrs` object.
3. **Reactive Bindings:** Attributes generated from the `bindings` object.

*Note: This ensures that reactive logic (like a dynamic `value`) always overrides static defaults.*

### Styling & Class Handling

- **Base Class:** The input always receives the `.form-control` class.
- **Label Class:** The label receives the `.form-label` class.
- **Safe Merging:** If a `class` is provided in `attrs`, it is prepended to the `.form-control` class, maintaining the expected CSS hierarchy.

---

## Accessibility (A11y)

The mixin strictly enforces the connection between the label and input:
- Uses the `id` to link `<label for="...">` and `<input id="...">`.
- **Pro Tip:** If you omit the `label`, remember to provide an `aria-label` or `aria-labelledby` within the `attrs` object to keep the input accessible.

---

## Examples

### 1. Basic Text Input with i18nn

The label will render as `<label class="form-label" for="user-name" data-i18n="Username">`.

```pug
+formInput('text', 'user-name', 'Username', 'Enter your name')
```

### 2. Reactive Two-Way Binding

Links the input to the `user.email` path in the reactive state.

```pug
+formInput('email', 'user-email', 'Email', '', 'email', '', {}, { model: 'user.email' })
```

### Number Input with Validation

```pug
+formInput('number', 'item-qty', 'Qty', '0', 'quantity', '1', { min: 1, max: 99, required: true })
```
