# Form Textarea Mixin (`+formTextarea`)

Renders a configurable `<textarea>` element with an optional `<label>`. This mixin is designed for multi-line text
input, providing automatic ID mapping, base styling, and seamless integration with reactive data models.

---

## Parameters

| Parameter         | Type             | Default    | Description                                                                    |
|-------------------|------------------|------------|--------------------------------------------------------------------------------|
| **`id`**          | `String`         | *required* | Unique identifier for the textarea. Also used for the label's `for` attribute. |
| **`label`**       | `String \| null` | `null`     | Visible label text. If `null` or empty, the `<label>` element is omitted.      |
| **`placeholder`** | `String`         | `''`       | Placeholder text displayed inside the textarea when empty.                     |
| **`name`**        | `String`         | `''`       | The `name` attribute used for form submission.                                 |
| **`attrs`**       | `Object \| null` | `{}`       | Additional HTML attributes (e.g., `{ rows: 5, readonly: true }`).              |
| **`bindings`**    | `Object \| null` | `{}`       | Reactive bindings for `@razerspine/runtime`.                                   |

---

## Behavior & Features

### Reactive Bindings

The mixin processes the `bindings` object using the `_mapRuntimeBindings` helper to create `data-*` attributes:

- `model` ➔ `data-model` (Two-way data binding for the textarea content)
- `show` ➔ `data-show`
- `bind` ➔ `data-bind`

### Styling & Structure

- **Base Class:** Automatically applies the `.form-textarea` CSS class.
- **Class Merging:** Any `class` provided within the `attrs` object is merged with the base `.form-textarea` class.
- **Label Association:** Ensures proper accessibility by linking the `<label for="...">` to the `<textarea id="...">`.

---

## Accessibility (A11y)

- **Labeled Inputs:** Providing a `label` string automatically creates an accessible relationship between the label and
  the field.
- **Hidden Labels:** If `label` is not provided, it is highly recommended to pass an `aria-label` via the `attrs`
  parameter to ensure the field is identifiable by screen readers.

---

## Examples

### 1. Basic Textarea with Model Binding

Standard usage for a comment field linked to a reactive post object.

```pug
+formTextarea(
  'comment', 
  'Comment', 
  'Enter your thoughts here...', 
  'comment', 
  {}, 
  { model: 'post.comment' }
)
```

### 2. Custom Rows and Visibility

A feedback field with a specific height that only appears based on a reactive condition.

```pug
+formTextarea(
  'feedback', 
  'Your Feedback', 
  'How can we improve?', 
  'feedback', 
  { rows: 10, minlength: 20 }, 
  { show: 'isFeedbackVisible' }
)
```

### 3. Read-only State

```pug
+formTextarea(
  'logs', 
  'System Logs', 
  '', 
  'logs', 
  { readonly: true, rows: 5, class: 'textarea--monospaced' }
)
```
