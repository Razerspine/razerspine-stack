# Radio Mixin (`+inputRadio`)

Renders a configurable radio input with a label, designed for use in reactive radio groups.

---

## Parameters

- **id** (String): Unique identifier. **Required**.
- **label** (String): Visible label text. **Required**.
- **name** (String): Name attribute used to group multiple radios. **Required**.
- **value** (String): Value submitted when this radio is selected. **Required**.
- **checked** (Boolean): Initial selection state. Default: `false`.
- **attrs** (Object): Additional attributes. Default: `{}`.
- **bindings** (Object): Reactive bindings (e.g., `model`, `click`). Default: `{}`.

---

## Behavior

- Wraps the elements in a `.check-control-label` container.
- Radios in a group should share the same `name` and `bindings.model`.
- Applies the `.input-base` styling class.

---

## Examples

```pug
// Reactive radio group bound to 'user.gender'
.input-group
  +inputRadio('m', 'Male', 'gender', 'male', false, {}, { model: 'user.gender' })
  +inputRadio('f', 'Female', 'gender', 'female', false, {}, { model: 'user.gender' })

// Disabled radio option
+inputRadio('opt', 'Option', 'group', 'val', false, { disabled: true })
```
