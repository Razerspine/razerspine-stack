# Form Textarea Mixin (`+formTextarea`)

Renders a configurable `<textarea>` element with an optional `<label>`. This mixin simplifies multi-line text input by
handling accessibility, applying base styles, and integrating with the reactive state via `@razerspine/runtime`.

---

## Parameters

| Parameter         | Type             | Default    | Description                                                                |
|-------------------|------------------|------------|----------------------------------------------------------------------------|
| **`id`**          | `String`         | *required* | Unique identifier. Used for the textarea `id` and label `for` attribute.   |
| **`label`**       | `String \| null` | `null`     | Visible label text. If provided, triggers automatic `data-i18n` attribute. |
| **`placeholder`** | `String`         | `''`       | Text displayed inside the textarea when empty.                             |
| **`name`**        | `String`         | `''`       | The `name` attribute for form submission.                                  |
| **`attrs`**       | `Object`         | `{}`       | Additional attributes (e.g., `{ rows: 5, readonly: true }`).               |
| **`bindings`**    | `Object`         | `{}`       | Reactive bindings for `@razerspine/runtime`.                               |

---

## Behavior & Features

### Automatic Internationalization (i18n)

Just like the input mixin, if a `label` is provided, the `<label>` element automatically receives a `data-i18n`
attribute. This allows the UI to be translated without manual attribute management.

### Attribute Priority Mapping

Attributes are merged in a predictable order (lowest to highest priority):

1. **Base:** `id`, `name`, `placeholder`.
2. **Custom:** Attributes passed via the `attrs` object.
3. **Reactive:** Attributes generated from the `bindings` object.

### Styling & Class Handling

- **Base Class:** The element always receives the `.form-textarea` class.
- **Label Class:** The label receives the `.form-label` class.
- **Class Merging:** Custom classes from `attrs` are prepended to the base `.form-textarea` class.

---

## Accessibility (A11y)

- **Label Association:** The mixin links `<label for="...">` and `<textarea id="...">` using the `id` parameter.
- **Screen Readers:** If you choose not to provide a `label`, ensure you include `aria-label` or `aria-labelledby` in
  the `attrs` object for a compliant user experience.

---

## Examples

### 1. Basic Textarea with i18n

The label will render as `<label class="form-label" for="bio" data-i18n="Biography">`.

```pug
+formTextarea('bio', 'Biography', 'Tell us about yourself...')
```

### 2. Reactive Model Binding

Synchronizes the textarea content with the `post.content` reactive path.

```pug
+formTextarea('comment', 'Comment', '', 'comment', { rows: 4 }, { model: 'post.content' })
```

### 3. Read-only Display

Useful for displaying logs or static multi-line data.

```pug
+formTextarea('logs', 'System Logs', '', 'logs', { readonly: true, rows: 8, class: 'is-monospaced' })
```
