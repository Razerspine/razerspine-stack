# Checkbox Mixin (`+inputCheckbox`)

Renders a configurable checkbox input nested within a label wrapper. This mixin provides a consistent accessible
structure, handles state initialization, and integrates with the reactive system.

---

## Parameters

| Parameter      | Type      | Default    | Description                                                       |
|----------------|-----------|------------|-------------------------------------------------------------------|
| **`id`**       | `String`  | *required* | Unique identifier for the input. Links the label to the checkbox. |
| **`label`**    | `String`  | *required* | Visible text displayed next to the checkbox.                      |
| **`name`**     | `String`  | `''`       | The `name` attribute for form submission or grouping.             |
| **`value`**    | `String`  | `'on'`     | The value submitted when the checkbox is checked.                 |
| **`checked`**  | `Boolean` | `false`    | Initial checked state of the input.                               |
| **`attrs`**    | `Object`  | `{}`       | Additional HTML attributes for the `<input>`.                     |
| **`bindings`** | `Object`  | `{}`       | Reactive bindings for `@razerspine/runtime`.                      |

---

## Behavior & Features

### HTML Structure

Unlike standard inputs, this mixin uses a nested structure for better styling and click-target area:

1. **Wrapper:** A `label.check-control-label` acts as the main container.
2. **Input:** The `<input type="checkbox">` is placed inside the label.
3. **Text:** The label text is wrapped in a `span.input-text`.

### Built-in i18n

The `span.input-text` element automatically receives a `data-i18n` attribute set to the `label` value, ensuring the
checkbox label is translatable.

### Styling & Class Handling

- **Base Class:** The checkbox input receives the `.input-base` class.
- **Custom Classes:** Any `class` passed via `attrs` is prepended to `.input-base`.
- **Control Class:** The outer wrapper always has the `.check-control-label` class.

### Attribute Priority

The mixin merges attributes in the following order (highest priority last):
`baseAttrs` (type, id, name, etc.) < `attrs` < `runtimeAttrs` (from bindings).

---

## Accessibility (A11y)

- **Implicit Association:** By nesting the `<input>` inside the `<label>`, the mixin provides a large, accessible click
  area.
- **Explicit Linking:** The `for` attribute on the label is still provided to ensure maximum compatibility with all
  assistive technologies.

---

## Examples

### 1. Basic Checkbox with i18n

The text will be wrapped in a translatable span: `<span class="input-text" data-i18n="I agree">I agree</span>`.

```pug
+inputCheckbox('agree', 'I agree', 'terms')
```

### 2. Reactive Model Binding

Links the checkbox state to the `form.accepted` reactive property.

```pug
+inputCheckbox('agree', 'Accept', 'terms', 'yes', false, {}, { model: 'form.accepted' })
```

### 3. Disabled & Pre-checked

```pug
+inputCheckbox('news', 'Newsletter', 'sub', '1', true, { disabled: true, class: 'is-readonly' })
```
