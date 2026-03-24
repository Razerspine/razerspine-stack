# Checkbox Mixin (`+inputCheckbox`)

Renders a configurable checkbox with a label and optional reactive bindings.

---

## Parameters

- **id** (String): Unique id for the input and label association. **Required**.
- **label** (String): Visible text shown next to the checkbox. **Required**.
- **name** (String): Name attribute for submission or grouping. Default: `''`.
- **value** (String): Value submitted when the checkbox is checked. Default: `'on'`.
- **checked** (Boolean): Whether the checkbox is checked by default. Default: `false`.
- **attrs** (Object): Additional attributes for the input. Default: `{}`.
- **bindings** (Object): Reactive bindings for `@razerspine/runtime`. Default: `{}`.

---

## Behavior

- Wraps the input and label text in a `.check-control-label` container.
- Integrates reactive directives via `_mapRuntimeBindings`.
- Merges the `.input-base` class with custom attributes.

---

## Examples

```pug
// Basic checkbox with reactive model
+inputCheckbox('agree', 'I agree', 'terms', 'yes', false, {}, { model: 'form.agreed' })

// Disabled checked checkbox
+inputCheckbox('newsletter', 'Subscribe', 'news', '1', true, { disabled: true })
```
