# Radio Mixin (`+inputRadio`)

Renders a configurable radio input element nested within a label wrapper. This mixin is optimized for reactive radio
groups, ensuring consistent styling, accessibility, and internationalization.

---

## Parameters

| Parameter      | Type      | Default    | Description                                                |
|----------------|-----------|------------|------------------------------------------------------------|
| **`id`**       | `String`  | *required* | Unique identifier for the input and label association.     |
| **`label`**    | `String`  | *required* | Visible label text. Automatically assigned to `data-i18n`. |
| **`name`**     | `String`  | *required* | Attribute used to group multiple radio buttons together.   |
| **`value`**    | `String`  | *required* | Value stored in the model when this radio is selected.     |
| **`checked`**  | `Boolean` | `false`    | Initial selection state.                                   |
| **`attrs`**    | `Object`  | `{}`       | Additional HTML attributes for the `<input>`.              |
| **`bindings`** | `Object`  | `{}`       | Reactive bindings for `@razerspine/runtime`.               |

---

## Behavior & Features

### HTML Structure

To provide a larger click area and flexible styling, the mixin uses a nested approach:

1. **Wrapper:** A `label.check-control-label` container.
2. **Input:** The `<input type="radio">` element.
3. **Text:** The visible text wrapped in a `span.input-text`.

### Built-in i18n

The `span.input-text` element automatically receives a `data-i18n` attribute. This ensures that every radio option in
your group is ready for translation without extra code.

### Styling & Class Handling

- **Base Class:** The radio input receives the `.input-base` class.
- **Custom Classes:** Classes passed via `attrs.class` are prepended to the base `.input-base` class.
- **Wrapper Class:** The container always uses `.check-control-label`.

### Attribute Priority

The `Object.assign` logic ensures the following override order (highest priority last):
`baseAttrs` (type, id, name, value, checked) < `attrs` < `runtimeAttrs` (from bindings).

---

## Accessibility (A11y)

- **Grouping:** All radios in a logical set **must** share the same `name` attribute. This allows screen readers to
  treat them as a single group where only one choice is possible.
- **Interaction:** Nesting the input inside the label allows users to toggle the radio by clicking either the button
  itself or the associated text.

---

## Examples

### 1. Reactive Radio Group

All options share the same `name` and `model` binding to act as a single reactive unit.

```pug
.radio-group
  +inputRadio('gender-m', 'Male', 'gender', 'm', false, {}, { model: 'user.gender' })
  +inputRadio('gender-f', 'Female', 'gender', 'f', false, {}, { model: 'user.gender' })
```

### 2. Pre-selected and Disabled Option

```pug
+inputRadio(
  'opt-1', 
  'Standard Plan', 
  'plan', 
  'std', 
  true, 
  { disabled: true, class: 'is-locked' }
)
```

### 3. Custom Attributes

```pug
+inputRadio('notify-yes', 'Yes', 'notify', '1', false, { 'aria-describedby': 'hint-text' })
```
